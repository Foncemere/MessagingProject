// io is the one that is connecting
//this works because I have it imported globally *see script on head*
const socket = io();

const form = document.querySelector(".typing-area .typing-box");
const divContainer = document.getElementsByClassName("message-area")[0];

form.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && form.textContent != "") {
    console.log("HMMM", JSON.stringify(form.textContent));
    //its emitting/releasing an event on to a flowing river
    socket.emit("chat message", form.textContent);
    form.textContent = "";
    e.preventDefault();
  } else if (e.key === "Enter" && form.textContent == "") {
    form.textContent = "";
    e.preventDefault();
  }
});
console.log("KEYS", Object.keys(socket));

console.log(`${socket.id} connected`);
socket.on("disconnect", () => {
  console.log(`${socket.id} disconnected`);
});

//think of this as a catcher, that will catch the message
socket.on("broadcast message", ({ msg, id }) => {
  console.log("RECEIVED FROM SERVER", msg);
  divContainer.innerHTML += `
    <div class="wrapper-message">
        <div class="username ${id === socket.id ? "you" : "user"}">${
    id === socket.id ? "you" : id
  }</div>
        <div class="message ${id === socket.id ? "you" : "user"}">${msg}</div>
    </div>
    `;
});

socket.on("displayDisconnectedUser", (id) => {
  divContainer.innerHTML += `
    <div class="userBroadcastStatus"> ${id} has left </div>
    `;
});

socket.on("displayConnectedUser", (id) => {
  if (id !== socket.id) {
    divContainer.innerHTML += `
      <div class="userBroadcastStatus"> ${id} has joined </div>
      `;
  }
});
