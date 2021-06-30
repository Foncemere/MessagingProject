const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//for the css static
app.use(express.static(__dirname + "/client"));
// app.use("/client", express.static(__dirname + "/client"));
//app.use(express.static(__dirname + "/server"));

console.log("__dirname", __dirname);

// first parameter is where the nodemon started
//dirname is needed
app.use("/server", express.static(__dirname + "/server"));

app.get("/", function (req, res) {
  //./ means current directory
  res.sendFile("index.html", { root: "./client" });
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
