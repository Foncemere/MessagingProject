import express, { static } from "express";
const app = express();
import { createServer } from "http";
const server = createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

app.use(static(__dirname + "/client"));
app.use("/client", static(__dirname + "/client"));

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: "./client" });
});

io.on("connection", (s) => {
  console.log("a user connected");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
