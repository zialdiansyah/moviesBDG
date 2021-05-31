var lat = -6.9115385
var long = 107.5955825

const desc = document.querySelector('.deskripsi');
const gambar = document.querySelector('img');

const locations = [
    {
        lat: -6.9085809,
        long: 107.610938,
        title: "Empire XXI BIP",
        address: "Bandung Indah Plaza, Jl. Merdeka No.56, Kota Bandung",
        image: "img/empire.jpg"
    },
    {
        lat: -6.8931907, 
        long: 107.6023293,
        title: "Cinema XXI Ciwalk",
        address: "Cihampelas Walk Bandung, Jl. Cihampelas No.160, Kota Bandung",
        image: "img/ciwalk.jpg"
    },
    {
        lat: -6.8929973, 
        long: 107.5827022,
        title: "BTC Cinema XXI",
        address: "Bandung Trade Centre P2 Lt.3, Jl. Doktor Djunjunan No.143-149, Kota Bandung",
        image: "img/btc.jpg"
    },
    {
        lat: -6.9171388, 
        long: 107.6066858,
        title: "Braga XXI",
        address: "Braga City Walk Lantai 2, Jl. Braga 99-101, Kota Bandung",
        image: "img/braga.jpg"
    },
    {
        lat: -6.9295834, 
        long: 107.5836468,
        title: "Festival Citylink XXI",
        address: "Festival Citylink Lt.3A, Jl. Peta No.241, Kota Bandung",
        image: "img/fcl.jpg"
    }
]
var mymap = L.map('mapid').setView([lat, long], 14);
for (const location of locations){
    var marker = L.marker(
        [location.lat, location.long],
        {
            title: location.title,
            address: location.address,
            image: location.image
        }
        ).on('click', onMarkerClick).addTo(mymap);
}

function onMarkerClick(e) {
    desc.innerHTML = '<strong>' + this.options.title + '</strong>' + '<br/>' +this.options.address;
    gambar.src = this.options.image;
}

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiemlhbGRpYW5zeWFoIiwiYSI6ImNrcGM4eGU1ajBpZW8ydXJyNmVwMWVnZjgifQ.QwgezbMW2t8PS9G-Y0CbKw'
}).addTo(mymap);