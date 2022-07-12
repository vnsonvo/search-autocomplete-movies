// Require dependencies
const express = require("express");
const cors = require("cors");
// destructuring
const { MongoClient, ObjectId } = require("mongodb");
const { response } = require("express");
require("dotenv").config();
const app = express();

// Declare database variables
const PORT = process.env.PORT || 8000;
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "sample_mflix",
  collection;

// Mongodb connection
MongoClient.connect(dbConnectionStr).then((client) => {
  console.log(`Connected to ${dbName} database`);
  db = client.db(dbName);
  collection = db.collection("movies");
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/search", async (req, res) => {
  try {
    const result = await collection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.query}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 3,
              },
            },
          },
        },
      ])
      .toArray();

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: error.message });
  }
});

app.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await collection.findOne({ _id: ObjectId(id) });
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, (_) => {
  console.log(`Server is running on port ${PORT}`);
});

// Search indexes fields JSON on MONGODB database
// {
//     "mappings": {
//         "dynamic": false,
//         "fields": {
//             "title": [
//                 {
//                     "foldDiacritics": false,
//                     "maxGrams": 7,
//                     "minGrams": 3,
//                     "tokenization": "edgeGram",
//                     "type": "autocomplete"
//                 }
//             ]
//         }
//     }
// }
