import * as React from 'react';
import { AppContext } from '../../state/AppContext';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import { MapboxSearchBox } from '@mapbox/search-js-web';

function searchNearby(lng, lat, callback) {
  fetch(`${import.meta.env.VITE_SUPABASE_URL}/${import.meta.env.VITE_SEARCH_NEARBY_PLACES}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ lat, lng }),
  })
    .then(res => res.json())
    .then(res => callback(null, res.data))
    .catch(err => callback(err, null))
}

export default function MboxLocation() {

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUB_KEY;

  const mapRef = React.useRef(null);
  const [map, setMap] = React.useState(null);
  const [myLocation, setMyLocation] = React.useState(null);
  const [_, setSelectedLocationIcon] = React.useState(null);
  const { location, setLocation } = React.useContext(AppContext);

  function swapIcons({ target: el }) {
    setSelectedLocationIcon(prev => {
      if (prev) {
        prev.src = 'src/assets/location-icon-48.png';
      }
      el.src = 'src/assets/location-icon-50.png'
      return el;
    });
  }

  // retrieve location once
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, []);

  // render map when location coordinates become available
  React.useEffect(() => {
    if (myLocation) {
      const { lat, lng } = myLocation
      const newMap = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v9',
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        zoom: 9,
        center: [lng, lat]
      });
      new mapboxgl.Marker().setLngLat(myLocation).addTo(newMap);
      setMap(newMap);
    }
  }, [myLocation]);

  // show select location from searchbox result
  React.useEffect(() => {
    if (map) {
      const search = new MapboxSearchBox();
      search.accessToken = import.meta.env.VITE_MAPBOX_PUB_KEY;
      search.marker = {
        color: '#adb',
        draggable: true,
      }
      search.options = {
        language: 'en',
        country: 'USA'
      }
      search.addEventListener('retrieve', (e) => {
        const feature = e.detail?.features[0]
        console.log(feature);

        const el = document.createElement('img');
        el.className = "marker"
        el.src = 'src/assets/point-down.svg';
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.backgroundSize = '100%';

        const marker = new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates);
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<div>${feature.properties.address}</div>`
            )
        )

        marker.addTo(map);  // Replace this line with code from step 5-2
      })
      map.addControl(search);
    }
  }, [map])

  //show markers when places service is available
  React.useEffect(() => {
    if (!map || !myLocation) return;

    function callback(err, data) {
      if (err == null) {
        for (const item of data.results) {
          // create markr element
          const el = document.createElement('img');
          el.className = "marker"
          el.src = 'src/assets/location-icon-48.png';
          el.style.width = "40px";
          el.style.height = "40px";
          el.style.backgroundSize = '100%';
          el.cursor = 'pointer'
          el.addEventListener('click', function(ev){
            const { name, formatted_address, geometry: { location: { lat, lng } } } = item;
            setLocation({ name, address: formatted_address, lat, lng });
            swapIcons(ev);
        })

          // Add markers for matched locations to the map.
          const marker = new mapboxgl.Marker(el);
          marker.setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<div>${item.name}</div>`
              )
          )
          marker.setLngLat(item.geometry.location);
          marker.addTo(map);
        }
      }
    }

    const { lng, lat } = myLocation;

    searchNearby(lng, lat, callback);
  }, [map, myLocation]);

  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      <Typography variant="body1" style={{ textAlign: "center" }}>{!location ? 'Click to select your location' : location.name}</Typography>

      <div ref={mapRef} style={{
        width: "100%",
        height: "50vh",
        margin: "10px auto",
        padding: 0
      }}>
      </div>
    </Box>
  )
}