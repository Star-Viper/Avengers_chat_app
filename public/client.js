const socket = io();
let intro;
let selectedAvatar;
let textarea;
let messageArea = document.querySelector(".messagearea");
const thorGifContainer = document.getElementById("thorGifContainer");
const avatarModal = document.getElementById("avatarModal");
const avatarOptionsContainer = document.querySelector(".avatar-options");
const chatSection = document.querySelector(".chatsection");

const avatars = [
  { name: "Iron Man", avatarUrl: "./im.png" },
  { name: "Captain America", avatarUrl: "./ca.png" },
  { name: "Thor", avatarUrl: "./thor.png" },
  { name: "Black Panther", avatarUrl: "./bp.png" },
  { name: "Spider-Man", avatarUrl: "./s.png" },
  { name: "Black Widow", avatarUrl: "./bw.png" },
  { name: "Captain Marvel", avatarUrl: "./cm.png" },
  { name: "Hulk", avatarUrl: "./h.png" },
  { name: "Doctor Strange", avatarUrl: "./d.png" },
  { name: "Hawkeye", avatarUrl: "./hk.png" },
  { name: "Baby Groot", avatarUrl: "./bg.png" },
  { name: "Scarlet Witch", avatarUrl: "./sw.png" },
  { name: "Nick Fury", avatarUrl: "./nf.png" },
  { name: "Loki", avatarUrl: "./loki.png" },
  { name: "Stan Lee", avatarUrl: "./stanley.png" },
];

function displayAvatarSelection() {
  avatarOptionsContainer.innerHTML = avatars
    .map((avatar) => {
      return `<div class="avatar-option" onclick="selectAvatar('${avatar.name}', '${avatar.avatarUrl}')">
                    <img src="${avatar.avatarUrl}" alt="${avatar.name}" />
                    <p>${avatar.name}</p>
                </div>`;
    })
    .join("");

  avatarModal.style.display = "block";
}

function selectAvatar(name, avatarUrl) {
  selectedAvatar = { user: name, avatarUrl: avatarUrl };
  intro = name;

  avatarModal.style.display = "none";

  chatSection.style.display = "block";

  textarea = document.getElementById("textarea");
  textarea.style.display = "block";
}
// Function to open file explorer modal
function openFileExplorer() {
  document.getElementById("fileInput").click();
}

// Function to handle file selection and sending
// Function to handle file selection and sending
function sendFile(files) {
    const file = files[0];
    const reader = new FileReader();
  
    reader.onload = function () {
      const fileData = reader.result;
      const fileName = file.name;
  
      // Update textarea with file name
      textarea.value += `File Attached: ${fileName}\n`;
  
      // Send file data to server
      socket.emit("file", { fileName, fileData });
    };
  
    reader.readAsDataURL(file);
  }
  
  // Listen for incoming files
  socket.on("file", (file) => {
    // Handle incoming file
    appendFile(file);
  });
  
  // Function to append file to message area
  function appendFile(file) {
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("message", "in");
  
    let markup = `
      <div class="message-content">
          <div class="user-info">
          
              <img class="avatar-img" src="${file.avatarUrl}" alt="${file.user}" />
              <h4>${file.user}</h4>
          </div>
          <p>File Received: <a href="${file.fileData}" download="${file.fileName}">${file.fileName}</a></p>
      </div>`;
    
    mainDiv.innerHTML = markup;
  
    messageArea.appendChild(mainDiv);
  }
  

// Listen for incoming files
socket.on("file", (file) => {
  // Handle incoming file
  console.log("Received file:", file);
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && textarea && intro && selectedAvatar) {
    sendMessage(textarea.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: intro,
    message: message.trim(),
    avatarUrl: selectedAvatar.avatarUrl,
  };
  appendMessage(msg, "out");
  textarea.value = "";
  scrollToBottom();

  showThorGif();

  socket.emit("message", msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement("div");
    let className = type;
    mainDiv.classList.add(className, "message");

    let markup = `
    
       <div class="message-content">
       <img class="avatar-img" src="${msg.avatarUrl}" alt="${msg.user}" />
            <div class="user-info">

                <h4>${msg.user}</h4>
            </div>`;

    // Check if the message is a file
    if (msg.fileData) {
        // Determine the type of file and embed accordingly
        if (msg.fileName.match(/\.(jpeg|jpg|gif|png)$/)) {
            markup += `<img src="${msg.fileData}" alt="${msg.fileName}" />`;
        } else if (msg.fileName.match(/\.(mp4|ogg|webm)$/)) {
            markup += `<video controls><source src="${msg.fileData}" type="video/mp4"></video>`;
        } else if (msg.fileName.match(/\.(mp3|wav)$/)) {
            markup += `<audio controls><source src="${msg.fileData}" type="audio/mp3"></audio>`;
        } else {
            // For other file types, provide a download link
            markup += `<p>File Attached: <a href="${msg.fileData}" download="${msg.fileName}">${msg.fileName}</a></p>`;
        }
    } else {
        markup += `<p>${msg.message}</p>`;
    }

    markup += `</div>`;
    mainDiv.innerHTML = markup;

    messageArea.appendChild(mainDiv);
}



socket.on("message", (msg) => {
  appendMessage(msg, "in");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

function showThorGif() {
  thorGifContainer.style.display = "block";
  thorGifContainer.classList.add("animate-thor-gif");
  setTimeout(() => {
    hideThorGif();
  }, 3000);
}

function hideThorGif() {
  thorGifContainer.style.display = "none";
}

displayAvatarSelection();
