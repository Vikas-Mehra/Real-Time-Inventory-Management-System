const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const route = require("./routes/route");

const app = express();

const path = require("path");
const clientFolderPath = path.join(__dirname, "../../client");
app.use(express.static(clientFolderPath));

const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer().any());

mongoose
  .connect(
    "mongodb+srv://Vikas:pAeAi3B.8Rhcfa2@cluster0.tnyfk.mongodb.net/DigitalCrew",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.log(err));

app.use("/", route);

io.on("connection", (socket) => {
  console.log(`\nNew connection: ${socket.id}`);

  socket.on("inventory-modified", (msg) => {
    console.log(`\nBroadcast: ${msg}`);
    io.emit("inventory-modified", msg);
  });
});

server.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on PORT " + (process.env.PORT || 3000));
});
