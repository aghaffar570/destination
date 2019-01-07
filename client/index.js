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


fetch('/api') // this is asyncronous. Everything comes before this call.
  .then(res => res.json())
  .then(data => {
    let [ hotels, activities, restaurants ] = data;

    destinationData = { hotels, activities, restaurants }

    // console.log(hotels, activities, restaurants)
    addToDom(hotels, 'hotels');
    addToDom(activities, 'activities');
    addToDom(restaurants, 'restaurants');

    const addBtns = document.querySelectorAll('button')
    addBtns.forEach(btn => {
      const idxEnd = btn.id.indexOf('-');
      const btnType = btn.id.slice(0, idxEnd);
      const selectedItems = destinationData[btnType]
      btn.addEventListener('click', () => { return addToItinerary(selectedItems, btnType) })
    })
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


function addToItinerary (items, choiceId) {
  // get selected value from option && place to display value
  const selectedValue = document.getElementById(`${choiceId}-choices`).value;
  const list = document.getElementById(`${choiceId}-list`);

  // add marker to map for selected value
  const item = items.filter(i => i.name === selectedValue)[0];
  const marker = createMarker(choiceId, item.place.location);
  marker.addTo(map);

  const newItem = document.createElement('li');
  newItem.innerHTML = selectedValue;
  list.appendChild(newItem)

  const newBtn = document.createElement('button');
  newBtn.innerHTML = '-';
  newBtn.classList.add('delete-btn')
  newBtn.addEventListener('click', () => { return deleteFromItinerary(newItem, marker) })
  newItem.appendChild(newBtn)

  map.flyTo({
    center: item.place.location,
    speed: 0.2,
    curve: 1
  })
}

function deleteFromItinerary(item, marker) {
  item.remove(); marker.remove()
}
