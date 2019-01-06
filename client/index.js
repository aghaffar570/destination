const mapboxgl = require("mapbox-gl");
const key = require('../secret');
const createMarker = require('./marker');

mapboxgl.accessToken = key.apiKey


const map = new mapboxgl.Map({
  container: "map",
  center: [-73.99, 40.715],
  zoom: 12,
  style: "mapbox://styles/mapbox/streets-v10"
});

const marker = createMarker('activity', [-73.9973, 40.7308])
marker.addTo(map);



let destinationData = {}


fetch('/api')
  .then(res => res.json())
  .then(data => {
    let [ hotels, activities, restaurants ] = data;
    // after retrieve data
    destinationData = { hotels, activities, restaurants }
    // allow dom maninpulation
    console.log(hotels, activities, restaurants)
    addToDom(hotels, 'hotels');
    addToDom(activities, 'activities');
    addToDom(restaurants, 'restaurants');

  const addHotel = document.getElementById('hotels-add')
  addHotel.addEventListener('click', () => { addToItinerary(hotels) })
  })
  .catch(console.error)


function addToDom (items, choiceId) {
  const choices = document.getElementById(`${choiceId}-choices`)
  items.forEach(item => {
    const option = document.createElement('option');
    option.innerHTML = item.name;
    choices.appendChild(option);
  })
}


function addToItinerary (e, items) {
  const selectedValue = document.getElementById('hotels-choices').value;
  const list = document.getElementById('hotels-list');

  const newItem = document.createElement('li');
  newItem.innerHTML = selectedValue;
  list.appendChild(newItem)

  console.log('IN CLICL', items)
  const item = items.filter(i => i.name === selectedValue);
  const marker = createMarker('hotels', item.place.location);
  marker.addTo(map);
}
