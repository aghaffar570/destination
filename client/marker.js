const mapboxgl = require("mapbox-gl");

const markerTypes = {
  activities: "http://i.imgur.com/WbMOfMl.png",
  hotels: "http://i.imgur.com/D9574Cu.png",
  restaurants: "http://i.imgur.com/cqR6pUI.png",
}

const createMarker = (type, coord) => {
  const markerElem = document.createElement("div");
  markerElem.style.width = "32px";
  markerElem.style.height = "39px";
  markerElem.style.backgroundImage = `url(${markerTypes[type]})`;
  return new mapboxgl.Marker(markerElem).setLngLat(coord)
}


module.exports = createMarker;

