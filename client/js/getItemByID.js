async function handleGetItemSubmit() {
  try {
    // console.log({ event });
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData);

    const url = "http://localhost:3000/inventory" + "/" + formData.get("id");
    console.log({ url });

    const response = await fetch(url, {
      method: "GET",
    });

    const res = await response.json(); // parses JSON response into native JavaScript objects.
    console.log({ res });

    if (res.status) {
      console.log(res);
      window.alert("Fetched Item-details successfully.");

      const main = document.getElementById("main__getItemById");

      let p1 = document.createElement("p");
      p1.innerText = "Title:  " + res.data.title;

      let p2 = document.createElement("p");
      p2.innerText = "Price:  " + res.data.price;

      let p3 = document.createElement("p");
      p3.innerText = "Quantity:  " + res.data.quntity;

      let p4 = document.createElement("p");
      p4.innerText = "Description:  " + res.data.description;

      main.appendChild(p1);
      main.appendChild(p2);
      main.appendChild(p3);
      main.appendChild(p4);
    } else {
      window.alert("Error: " + res.message);
    }
  } catch (error) {
    return console.log(error);
  }
}
