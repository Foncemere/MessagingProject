const socket = io();

const form = document.querySelector(".typing-area .typing-box");

form.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    console.log("HMMM", JSON.stringify(form.textContent));
    socket.emit("chat message", form.textContent);
  }
});
console.log("KEYS", Object.keys(socket));
