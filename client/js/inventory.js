socket.on("inventory-modified", (msg) => {
  console.log(`Emit: ${msg}`);
  window.location.reload();
});

/**
 *
 *
 */

fetch("http://localhost:3000/inventory")
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (apiJsonData) {
    console.log(apiJsonData);
    renderDataInTheTable(apiJsonData.data);
  });

/**
 *
 *
 */

function renderDataInTheTable(collection) {
  const mytable = document.getElementById("inventory__table");

  collection.forEach((doc) => {
    let newRow = document.createElement("tr");

    let id = document.createElement("td");
    id.innerText = doc._id;
    newRow.appendChild(id);

    let title = document.createElement("td");
    title.innerText = doc.title;
    newRow.appendChild(title);

    let description = document.createElement("td");
    description.innerText = doc.description;
    newRow.appendChild(description);

    let price = document.createElement("td");
    price.innerText = doc.price;
    newRow.appendChild(price);

    let quantity = document.createElement("td");
    quantity.innerText = doc.quantity;
    newRow.appendChild(quantity);

    mytable.appendChild(newRow);
  });
}
