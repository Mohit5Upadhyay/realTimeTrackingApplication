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
// Initialize the Leaflet Map
const map = L.map('map').setView([51.505, -0.09], 13); // Set default view to a location and zoom level

// Initialize Heatmap Layer
const heatmapLayer = L.heatLayer([], {
  radius: 25,
  maxOpacity: 0.8,
  scaleRadius: true,
}).addTo(map);

// Function to Update Heatmap Data
function updateHeatmap(data) {
  const heatmapPoints = data.map(({ lat, lng, intensity }) => [lat, lng, intensity]);
  heatmapLayer.setLatLngs(heatmapPoints);
}

// Customizable Radius and Opacity Controls
document.getElementById("radius-slider").addEventListener("input", (event) => {
  heatmapLayer.setOptions({ radius: event.target.value });
});

document.getElementById("opacity-slider").addEventListener("input", (event) => {
  heatmapLayer.setOptions({ maxOpacity: event.target.value });
});

// Interactive Legend
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");
  div.innerHTML = "Heatmap Intensity Scale"; // Customize as needed
  return div;
};
legend.addTo(map);

// Zoom-Level Dependent Radius Adjustment
map.on("zoomend", () => {
  const zoomLevel = map.getZoom();
  heatmapLayer.setOptions({ radius: zoomLevel * 2 });
});

// Real-Time Data Updates with WebSocket
const socket = new WebSocket("wss://your_server_url");
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateHeatmap(data);
};

// Example Filtering Function
function filterHeatmap(timeRange, category) {
  const filteredData = data.filter(entry => {
    return entry.time >= timeRange && entry.category === category;
  });
  updateHeatmap(filteredData);
}
