const express = require("express");
const cors = require("cors");
// destructuring
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "sample_mflix",
  collection;
const app = express();

MongoClient.connect(dbConnectionStr).then((client) => {
  console.log(`Connected to ${dbName} database`);
  db = client.db(dbName);
  collection = db.collection("movies");
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(PORT, (_) => {
  console.log(`Server is running on port ${PORT}`);
});
