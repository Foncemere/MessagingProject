const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

async function waitForIds() {
  try {
    console.log("calling ids");
    const ids = await io.allSockets();
    return ids;
  } catch (e) {
    console.log("error in getting ids");
  }
}

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  const idsGiven = waitForIds();
  console.log(idsGiven);
  io.emit("displayConnectedUser", { id: socket.id, idsGiven });

  //when the person disconnects, perform this function
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    io.emit("displayDisconnectedUser", socket.id);
  });

  //when person chats, perform this action
  //this is the catcher of that event on the river
  socket.on("chat message", (msg) => {
    console.log("FROM CLIENT");
    //this is just a name/string/identifier
    io.emit("broadcast message", {
      msg,
      id: socket.id,
    });
  });

  socket.on("image", (img) => {
    io.emit("send image", {
      img,
      id: socket.id,
    });
  });
});

//for the css static
// __dirname is where the nodemon started
app.use(express.static(__dirname + "/client"));

//first parameter localhost:3000/
app.get("/", function (req, res) {
  //./ means current directory

  //// You're telling it to 'server'/return the index.html file
  //// with the localfolder `./client` as it's root
  //// so any files within the ./client folder can be accessed relatively;
  //// i.e. `/index.css` -> localhost:3000/index.css => ./client/index.css
  res.sendFile("index.html", { root: "./client" });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
