// io is the one that is connecting
const socket = io();

const form = document.querySelector(".typing-area .typing-box");
const divContainer = document.getElementsByClassName("message-area");

console;

form.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    console.log("HMMM", JSON.stringify(form.textContent));
    socket.emit("chat message", form.textContent);
    form.textContent = "";

    e.preventDefault();
  }
});
console.log("KEYS", Object.keys(socket));

console.log(`${socket.id} connected`);
socket.on("disconnect", () => {
  console.log(`${socket.id} disconnected`);
});

socket.on("chat message", ({ msg, id }) => {
  console.log("RECEIVED FROM SERVER", msg);
  const divContainer = document.getElementsByClassName("message-area")[0];
  divContainer.innerHTML += `
    <div class="wrapper-message">
        <div class="username ${id === socket.id ? "you" : "user"}">${
    id === socket.id ? "you" : id
  }</div>
        <div class="message ${id === socket.id ? "you" : "user"}">${msg}</div>
    </div>
    `;
  setTimeout(() => {
    divContainer.scrollTop = divContainer.scrollHeight;
  }, 300);
});

console.log(testy);
