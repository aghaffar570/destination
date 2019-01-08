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

// const marker = createMarker('activity', [-73.9973, 40.7308])
// marker.addTo(map);



const state = {
  attractions: {
    hotels: [],
    restaurants: [],
    activities: []
  },
  selectedAttractions: []
};


fetch('/api') // this is asyncronous. Everything will run before this call.
  .then(res => res.json())
  .then(data => {
    let [ hotels, activities, restaurants ] = data;

    state.attractions = { hotels, activities, restaurants }

    // console.log(hotels, activities, restaurants)
    addToDom(hotels, 'hotels');
    addToDom(activities, 'activities');
    addToDom(restaurants, 'restaurants');

    const addBtns = document.querySelectorAll('button')
    addBtns.forEach(addListenerToBtn)
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

function addListenerToBtn (btn) {
  const idxEnd = btn.id.indexOf('-');
  const btnType = btn.id.slice(0, idxEnd);
  const selectedItems = state.attractions[btnType]
  btn.addEventListener('click', () => { return addToItinerary(selectedItems, btnType) })
}

function addToItinerary (items, choiceId) {

  const selectedValue = document.getElementById(`${choiceId}-choices`).value;
  const list = document.getElementById(`${choiceId}-list`);

  if(!state.selectedAttractions.includes(selectedValue)) state.selectedAttractions.push(selectedValue)
  else return;

  const marker = displayMarker(items, selectedValue, choiceId);
  const newListItem = createNewListItem(list, selectedValue);
  createNewDeleteBtn(newListItem, marker);
}

function createNewListItem(parentItem, value) {
  const newItem = document.createElement('li');
  newItem.innerHTML = value;
  parentItem.appendChild(newItem)
  return newItem;
}


function createNewDeleteBtn(parentItem, marker) {
  const newBtn = document.createElement('button');
  newBtn.innerHTML = '-';
  newBtn.classList.add('delete-btn')
  newBtn.addEventListener('click', () => { return deleteFromItinerary(parentItem, marker) })
  parentItem.appendChild(newBtn)
  return newBtn;
}

function displayMarker (listItems, value, type) {
  const item = listItems.filter(i => i.name === value)[0];
  const marker = createMarker(type, item.place.location);
  marker.addTo(map);

  map.flyTo({
    center: item.place.location,
    speed: 0.2,
    curve: 1
  })
  return marker
}

function deleteFromItinerary(item, marker) {
  console.log(item.textContent, state.selectedAttractions)
  item.remove(); marker.remove()
}
