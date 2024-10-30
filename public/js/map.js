// Initialize the Leaflet Map
const map = L.map('map').setView([51.505, -0.09], 13); // Default location and zoom level

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

// Slider Controls for Radius and Opacity
document.getElementById("radius-slider").addEventListener("input", (event) => {
  const newRadius = parseInt(event.target.value, 10);
  heatmapLayer.setOptions({ radius: newRadius });
});

document.getElementById("opacity-slider").addEventListener("input", (event) => {
  const newOpacity = parseFloat(event.target.value);
  heatmapLayer.setOptions({ maxOpacity: newOpacity });
});

// Interactive Legend
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");
  div.innerHTML = "Heatmap Intensity Scale";
  return div;
};
legend.addTo(map);

// Adjust Radius Based on Zoom Level
map.on("zoomend", () => {
  const zoomLevel = map.getZoom();
  heatmapLayer.setOptions({ radius: zoomLevel * 2 });
});

// WebSocket for Real-Time Data Updates
const socket = new WebSocket("ws://localhost:8080");
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateHeatmap(data);
};

// Filtering Function for Heatmap
function filterHeatmap(data, timeRange, category) {
  const filteredData = data.filter(entry => {
    return entry.time >= timeRange[0] && entry.time <= timeRange[1] && entry.category === category;
  });
  updateHeatmap(filteredData);
}

// Example call to the filterHeatmap function
function applyFilter() {
  const timeRange = [startTime, endTime];
  const category = "desiredCategory";
  filterHeatmap(data, timeRange, category);
}
