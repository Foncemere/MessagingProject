// io is the one that is connecting
//this works because I have it imported globally *see script on head*
const socket = io();

const form = document.querySelector(".typing-ui .typing-box");
const divContainer = document.getElementsByClassName("message-area")[0];
const imgPreview = document.getElementsByClassName("image-preview");
const sendImage = document.querySelector(".send-button");
const dropRegion = document.getElementsByClassName("wrapper")[0];
const imagePreviewRegion = document.getElementsByClassName("image-preview")[0];
const wrapperMessage = document.getElementsByClassName("wrapper-message")[0];
const swatch = document.getElementsByClassName("swatch")[0];
const onlineUsersList = document.getElementsByClassName("online-users-list")[0];
const menu = document.getElementsByClassName("side-menu")[0];
let isDark = false;
let sendButtonSource = document.getElementsByClassName("send-button")[0];

//toggle dark/light mode ---------------------------------

const toggleDarkLightMode = () => {
  if (!isDark) {
    swatch.classList.remove("two");
    swatch.classList.add("one");
    dropRegion.classList.remove("lightmodeColor");
    dropRegion.classList.add("darkmodeColor");
    menu.classList.remove("lightmodeColor");
    menu.classList.add("darkmodeColor");
    sendButtonSource.src = "send-white.svg";
    darkmode();
    isDark = true;
  } else {
    swatch.classList.remove("one");
    swatch.classList.add("two");
    dropRegion.classList.remove("darkmodeColor");
    dropRegion.classList.add("lightmodeColor");
    menu.classList.remove("darkmodeColor");
    menu.classList.add("lightmodeColor");
    sendButtonSource.src = "send.svg";
    lightmode();
    isDark = false;
  }
};

// function of dark and light mode -----------------------
const lightmode = () => {
  document.body.classList.remove("trigger");
  dropRegion.classList.remove("toggledClassNightMode");
};

function darkmode() {
  document.body.classList.add("trigger");
  dropRegion.classList.add("toggledClassNightMode");
}

//start of drag and drop feature ---------------------------
const fakeInput = document.createElement("input");
fakeInput.type = "file";
fakeInput.accept = "image/*";
fakeInput.multiple = true;
sendImage.addEventListener("click", function () {
  fakeInput.click();
});

fakeInput.addEventListener("change", function () {
  const files = fakeInput.files;
  handleFiles(files);
});

const preventDefault = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

dropRegion.addEventListener("dragenter", preventDefault, false);
dropRegion.addEventListener("dragleave", preventDefault, false);
dropRegion.addEventListener("dragover", preventDefault, false);
dropRegion.addEventListener("drop", preventDefault, false);

const handleDrop = (e) => {
  var dt = e.dataTransfer,
    files = dt.files;

  if (files.length) {
    handleFiles(files);
  } else {
    // check for img
    var html = dt.getData("text/html"),
      match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
      url = match && match[1];
    //if the image was from a url
    if (url) {
      uploadImageFromURL(url);
      return;
    }
  }

  const uploadImageFromURL = (url) => {
    var img = new Image();
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");

    img.onload = function () {
      c.width = this.naturalWidth; // update canvas size to match image
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0); // draw in image
      c.toBlob(function (blob) {
        // get content as PNG blob

        // call our main function
        handleFiles([blob]);
      }, "image/png");
    };
    img.onerror = function () {
      alert("Error in uploading");
    };
    img.crossOrigin = ""; // if from different origin
    img.src = url;
  };
};

function validateImage(image) {
  // check the type
  var validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (validTypes.indexOf(image.type) === -1) {
    alert("Invalid File Type");
    return false;
  }

  // check the size
  var maxSizeInBytes = 10e6; // 10MB
  if (image.size > maxSizeInBytes) {
    alert("File too large");
    return false;
  }

  return true;
}
let imageFile = [];

function remove(el) {
  el.remove();
}

function previewAnduploadImage(image) {
  // const imgElement = document.createElement("img");
  // //set up the functionality
  // imgElement.className = "prepped-image";
  // imgElement.onclick = function () {
  //   imagePreviewRegion.removeChild(this);
  // };

  // imagePreviewRegion.appendChild(imgElement);

  var reader = new FileReader();

  reader.onload = function (e) {
    // imgElement.src = e.target.result;
    imagePreviewRegion.innerHTML += `
    <img class="prepped-image" src="${e.target.result}" onClick="removePreview(this)"></img>
    `;
    imageFile.push(e.target.result); //-----------
  };
  reader.readAsDataURL(image);
}
dropRegion.addEventListener("drop", handleDrop, false);

const handleFiles = (files) => {
  for (let i = 0, len = files.length; i < len; i++) {
    if (validateImage(files[i])) previewAnduploadImage(files[i]);
  }
};
//-----------------
form.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && form.textContent != "") {
    console.log("HMMM", JSON.stringify(form.textContent));
    //its emitting/releasing an event on to a flowing river
    socket.emit("chat message", form.textContent);
    form.textContent = "";
    e.preventDefault();
  } else if (
    e.key === "Enter" &&
    form.textContent == "" &&
    imageFile.length !== 0
  ) {
    socket.emit("image", imageFile);
    form.textContent = "";
    e.preventDefault();
    imagePreviewRegion.innerHTML = "";
    imageFile = [];
  } else if (
    e.key === "Enter" &&
    form.textContent == "" &&
    imageFile.length == 0
  ) {
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

socket.on("displayDisconnectedUser", ({ id, idsGiven }) => {
  divContainer.innerHTML += `
    <div class="userBroadcastStatus"> ${id} has left </div>
    `;
  onlineUsersList.innerHTML = "";
  for (let i = 0; i < idsGiven.length; i++)
    onlineUsersList.innerHTML += `
    <div class="online-user ${idsGiven[i]}"> ${idsGiven[i]} </div>
    `;
});

socket.on("displayConnectedUser", ({ id, idsGiven }) => {
  if (id !== socket.id) {
    divContainer.innerHTML += `
      <div class="userBroadcastStatus"> ${id} has joined </div>
      `;
  }

  //better to just clear it and make a new list compared to finding and removing
  onlineUsersList.innerHTML = "";
  for (let i = 0; i < idsGiven.length; i++)
    onlineUsersList.innerHTML += `
  <div class="online-user ${idsGiven[i]}"> ${idsGiven[i]} </div>
  `;
});

socket.on("send image", ({ img, id }) => {
  // const sentImage = document.createElement("img");
  // sentImage.classList = "image";
  // sentImage.onclick = function () {
  //   window.open(this.src, "_blank");
  // };

  content = "";
  content += `<div class='wrapper-message'>
  <div class="username ${id === socket.id ? "you" : "user"}">${
    id === socket.id ? "you" : id
  }</div>
  <div class = "images-container">`;
  for (let i = 0, len = img.length; i < len; i++) {
    content += `<img
    class="image ${id === socket.id ? "you" : ""}"
    src="${img[i]}"
    onclick="window.open(this.src, '_blank');"
  />`;
  }
  content += "</div></div>";
  divContainer.innerHTML += content;
});
