document.addEventListener("DOMContentLoaded", () => {
  $("#title").autocomplete({
    source: async function (req, res) {
      const data = await fetch(`/search?query=${req.term}`)
        .then((results) => results.json())
        .then((data) =>
          data.map((el) => {
            return {
              label: el.title,
              value: el.title,
              id: el._id,
            };
          })
        );
      res(data);
    },
    minLength: 2,
    select: function (event, ui) {
      fetch(`/get/${ui.item.id}`)
        .then((result) => result.json())
        .then((data) => {
          document.querySelector("#cast").textContent = "";
          data.cast.forEach((cast) => {
            const li = document.createElement("li");
            li.textContent = cast;
            document.querySelector("#cast").appendChild(li);
          });
          document.querySelector("img").src = data.poster;
        });
    },
  });
});
