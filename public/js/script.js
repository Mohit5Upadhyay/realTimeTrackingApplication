const socket = io();

// Watch user's position
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        const now = new Date();
        const currentDate = now.toDateString();
        const currentTime = now.toTimeString();

        socket.emit("send-location", {
            latitude,
            longitude,
            date: currentDate,
            time: currentTime
        });
        console.log("Sending location:", latitude, longitude, "Date:", currentDate, "Time:", currentTime);
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 2000
    });
}

// Initialize Leaflet Map
const map = L.map("map").setView([0, 0], 10);

// Load OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

// Markers storage
const markers = {};

// Receive and display location updates from the server
socket.on("receive-location", (data) => {
    const { id, longitude, latitude } = data;
    console.log("Received location:", id, latitude, longitude);

    // Set the map view to the updated location
    map.setView([latitude, longitude], 15);

    // Update existing marker or create a new one
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude])
            .bindPopup(`<b>KNIT Sultanpur </b><br>Location: [${latitude}, ${longitude}]`)
            .addTo(map);
    }
});

// Remove disconnected user marker
socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});


// Function to search for a location
function searchLocation() {
    const locationInput = document.getElementById('location-input').value;
    if (locationInput) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = data[0].lat;
                    const lon = data[0].lon;
                    map.setView([lat, lon], 15);
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${locationInput}</b><br>Location: [${lat}, ${lon}]`).openPopup();
                } else {
                    alert('Location not found!');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// Functions to toggle between Street View and Satellite View
function setStreetView() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
    }).addTo(map);
}

function setSatelliteView() {
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: 'Satellite'
    }).addTo(map);
}

// Real-Time Tracking Toggle
const realTimeToggle = document.getElementById('real-time-toggle');
realTimeToggle.addEventListener('change', function () {
    if (this.checked) {
        // Enable real-time tracking logic (re-integrate your existing real-time tracking code here)
        console.log('Real-time tracking enabled');
    } else {
        // Disable real-time tracking
        console.log('Real-time tracking disabled');
    }
});


//redirecting to the contact us page from the index page
document.getElementById('contact-link').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = '/html/contact.html'; // Redirect to the contact page
});

// Dark Mode Toggle Logic
const darkModeToggle = document.getElementById('dark-mode-toggle');
const htmlElement = document.documentElement;
const darkModeIcon = darkModeToggle.querySelector('i');

function setDarkMode(enabled) {
    if (enabled) {
        htmlElement.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        if (darkModeIcon) {
            darkModeIcon.classList.remove('bx-moon');
            darkModeIcon.classList.add('bx-sun');
        }
    } else {
        htmlElement.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        if (darkModeIcon) {
            darkModeIcon.classList.remove('bx-sun');
            darkModeIcon.classList.add('bx-moon');
        }
    }
}

darkModeToggle.addEventListener('click', () => {
    const isDark = htmlElement.classList.contains('dark-mode');
    setDarkMode(!isDark);
});

// On page load, set mode based on localStorage or system preference
(function initializeDarkMode() {
    const userPref = localStorage.getItem('darkMode');
    if (userPref === 'enabled') {
        setDarkMode(true);
    } else if (userPref === 'disabled') {
        setDarkMode(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }
})();


//redirecting to the contact us page from the index page
document.getElementById('register-link').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = '/html/registter.html'; // Redirect to the contact page
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
  icon.classList.remove('bx-moon');
  icon.classList.add('bx-sun');
}

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    icon.classList.remove('bx-moon');
    icon.classList.add('bx-sun');
  } else {
    icon.classList.remove('bx-sun');
    icon.classList.add('bx-moon');
  }
});
