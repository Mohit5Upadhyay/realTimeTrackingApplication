const express = require("express");
const app = express();
const path = require("path");

const http = require("http");
const cors = require("cors")

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// app.get('/contact', (req, res) => {
//   res.render("contact");
// });

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  // console.log("connected");
  socket.on("disconnect", function () {
    io.emit("user-disconnect", socket.id);
  });
});

app.get("/", function (req, res) {
  console.log(path.join(__dirname, 'views', 'index.html'));
  // res.render("index");
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
