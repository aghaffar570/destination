const mapboxgl = require("mapbox-gl");
const key = require('../secret');
const createMarker = require('./marker');

mapboxgl.accessToken = key.mapApiKey
const weatherApiKey = key.weatherApiKey
const nycId = 10012
const weatherData = `http://api.openweathermap.org/data/2.5/forecast?q=${nycId},us&APPID=${weatherApiKey}&units=imperial`


const map = new mapboxgl.Map({ // sets up the map
  container: "map",
  center: [-73.99, 40.715],
  zoom: 12,
  style: 'mapbox://styles/mapbox/light-v9',
});

// sample marker
// const marker = createMarker('activity', [-73.9973, 40.7308])
// marker.addTo(map);

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');



const state = { // local state
  attractions: {
    hotels: [],
    restaurants: [],
    activities: []
  },
  selectedAttractions: []
};


fetch('/api') // this is asynchronous. Everything will run before this call.
  .then(res => res.json())
  .then(data => {
    let [ hotels, activities, restaurants ] = data;
    state.attractions = { hotels, activities, restaurants } // store in state

    console.log(hotels, activities, restaurants)
    // populate all option data to the respective selections
    addOptionsToDom(hotels, 'hotels');
    addOptionsToDom(activities, 'activities');
    addOptionsToDom(restaurants, 'restaurants');

    const addBtns = document.querySelectorAll('button')
    console.log(addBtns, 'addBTNS');

    addBtns.forEach(addListenerToBtn)
  })
  .catch(console.error)


function addOptionsToDom (attractionItems, category) { // appends options to each selection category
  const choices = document.getElementById(`${category}-choices`)
  attractionItems.forEach(item => { // creates an option tag for each item
    const option = document.createElement('option');
    option.innerHTML = item.name;
    choices.appendChild(option);
  })
}

function addListenerToBtn (btn) { // allows item selection with btn click
  const idxEnd = btn.id.indexOf('-');
  const btnType = btn.id.slice(0, idxEnd); // retrieves btn category
  const selectedItems = state.attractions[btnType] // retrieves the respective array from state
  btn.addEventListener('click', () => { return addToItinerary(selectedItems, btnType) })
}




function addToItinerary (attractionItems, category) { // adds item to itinerary and displays marker
  const selectedValue = document.getElementById(`${category}-choices`).value; // grabs selected option
  const list = document.getElementById(`${category}-list`);

  // only add item to itinerary once
  if(!state.selectedAttractions.includes(selectedValue))
    state.selectedAttractions.push(selectedValue)
  else return //alert('already added to itinerary');

  // add marker on map for selected item
  const marker = displayMarker(attractionItems, selectedValue, category);

  // add item to dom list with its corresponding delete btn
  const newListItem = createNewListItem(list, selectedValue);
  createNewDeleteBtn(newListItem, marker);
}

function createNewListItem(parentItem, value) { // creates new li tag
  const newItem = document.createElement('li');
  newItem.innerHTML = value;
  parentItem.appendChild(newItem)
  return newItem;
}

function displayMarker (listItems, value, categoryType) { // adds marker and zooms-in on location
  const item = listItems.filter(i => i.name === value)[0]; // grab item with all its info
  const marker = createMarker(categoryType, item.place.location);
  marker.addTo(map);

  map.flyTo({ // zooms to location
    center: item.place.location,
    speed: 0.2,
    curve: 1
  })
  return marker
}

function createNewDeleteBtn(parentItem, marker) {
  const newBtn = document.createElement('button');
  newBtn.innerHTML = '-';
  newBtn.classList.add('delete-btn')
  newBtn.addEventListener('click', () => { return deleteFromItinerary(parentItem, marker) })
  parentItem.appendChild(newBtn)
  return newBtn;
}

function deleteFromItinerary(item, marker) { // delete marker, item, and from state
  item.remove(); marker.remove()
  state.selectedAttractions = state.selectedAttractions.length > 1
    ? state.selectedAttractions.filter(attraction => attraction !== `${item.textContent}`)
    : []
}
