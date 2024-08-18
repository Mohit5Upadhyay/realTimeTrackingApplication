
const socket = io();

// console.log("hey");

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude }= position.coords;
        const now = new Date();
        const currentDate = now.toDateString();
        const currentTime = now.toTimeString();
        socket.emit("send-location",{
            latitude,
            longitude,
            date: currentDate,
            time: currentTime
        })
        console.log("Sending location:", latitude, longitude ,"Date:", currentDate, "Time:", currentTime);
    },(error)=>{
        console.log(error);
    },{
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:2000
    })
}

const map = L.map("map").setView([0,0],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map)

const markers = {}

socket.on("receive-location",(data)=>{
    const {id ,longitude,latitude} = data;
    console.log("Received location:", id, latitude, longitude);
    map.setView([latitude,longitude],15);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude,longitude])
        .bindPopup(`<b>User ${id}</b><br>Location: [${latitude}, ${longitude}]`)
        .addTo(map);
    }
})


socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})