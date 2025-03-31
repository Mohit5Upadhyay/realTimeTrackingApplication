const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const cors = require("cors");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", function () {
    io.emit("user-disconnect", socket.id);
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server is currently running on http://localhost:${PORT}`);
  console.log(`WebSocket server is currently running on ws://localhost:${PORT}/`);
});

module.exports = app;
