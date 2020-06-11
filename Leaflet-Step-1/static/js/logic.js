// Store our API endpoint inside url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the URL for earthquake data
d3.json(url, function (data) {

  console.log(data.features);

  var earthquakeCircles = []

  data.features.forEach(function (feature) {
    // console.log(feature.properties.mag);

    var magnitude = feature.properties.mag

    getColor(magnitude)

    // Add circles to map
    earthquakeCircles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      // Adjust radius
      radius: magnitude * 30000
    }).bindPopup(`<h3> Magnitude: ${magnitude} <hr> 
                       Location: ${feature.properties.place} <hr>
                  </h3>
                  <p> ${new Date(feature.properties.time)}</p>`));

    // console.log(color);
    // console.log(earthquakeCircles);
  // send data.features to createEarthquakeFeatures function
});
var earthquakesLayer = L.layerGroup(earthquakeCircles);
createMap(earthquakesLayer);
});

function getColor(magnitude) {

  color = "";
  if (magnitude >= 6) {
      color = "red";
  }
  else if (magnitude >= 5) {
      color = "orange";
  }
  else if (magnitude >= 4) {
      color = "yellow";
  }
  else if (magnitude >= 2) {
      color = "blue";
  }
  else {
      color = "green";
  }
}

function createMap(earthquakesLayer) {

  console.log(earthquakesLayer);
  // Define satellite map, dark map, and outdoors map layers
  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/dark-v9",
    accessToken: API_KEY
  });

  var outmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/outdoors-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satmap,
    "Dark": darkmap,
    "Outdoors": outmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakesLayer,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map('map', {
    center: [
      37.09, -105.71
    ],
    zoom: 3,
    layers: [satmap, earthquakesLayer]
  });

  // earthquakesLayer.addTo(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomleft'});
  
  legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend');
  labels = ['<strong>Magnitude</strong>'],
  categories = ['0-2','2-4','4-5','5-6','6+'];

  for (var i = 0; i < categories.length; i++) {

          div.innerHTML += 
          labels.push(
              '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
          (categories[i] ? categories[i] : '+'));

      }
      div.innerHTML = labels.join('<br>');
  return div;
  };
  legend.addTo(myMap);
};