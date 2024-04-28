const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http); 
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle incoming messages
    socket.on("message", (msg) => {
        // Broadcast the message to all clients except the sender
        socket.broadcast.emit("message", msg);
    });

    // Handle incoming files
    socket.on("file", (file) => {
        // Broadcast the file data to all clients except the sender
        socket.broadcast.emit("file", file);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
