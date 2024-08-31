import * as React from 'react';
import { AppContext } from '../../state/AppContext';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';

export default function Minigolf() {

  const mapRef = React.useRef(null);
  const [myLocation, setMyLocation] = React.useState(null);
  const [map, setMap] = React.useState(null);
  const [ui, setUi] = React.useState(null);
  const { setLocation } = React.useContext(AppContext);

  async function trySuggestPlaces(map, ui, loc) {
    const places = await fetch(`${import.meta.env.VITE_HERE_MAPS_API_URL}?apiKey=${import.meta.env.VITE_HERE_MAPS_API_KEY}&at=${loc.lat},${loc.lng}&in=countryCode:USA&limit=5&lang=en&q=minigolf`)
      .then(res => res.json());

    const [{ position: { lat, lng }, address: { label }, title, }] = places.items;
    setLocation({ name: title, address: label.split(","), location: { lat, lng } });

    var LocationOfMarker = { lat, lng };
    // Create a marker icon from an image URL:
    var pngIcon = new H.map.Icon("./src/assets/minigolf.png", { size: { w: 30, h: 30 } });

    // Create a marker using the previously instantiated icon:
    var marker = new H.map.Marker(LocationOfMarker, { icon: pngIcon });
    marker.setData(title)

    // add 'tap' event listener, that opens info bubble, to the group
    marker.addEventListener('tap', function (evt) {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains
      var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        // read custom data
        content: evt.target.getData()
      });
      // show info bubble
      ui.addBubble(bubble);
    }, false);

    // Add the marker to the map:
    map.addObject(marker);
  }

  async function findMyLocation({ lat, lng }) {
    //Step 1: initialize communication with the platform
    var platform = new H.service.Platform({
      'apikey': import.meta.env.VITE_HERE_MAPS_API_KEY
    });

    var defaultLayers = platform.createDefaultLayers();
    //Step 2: initialize a map - this map is centered over Europe
    var map = new H.Map(mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat, lng },
        zoom: 9,
        pixelRatio: window.devicePixelRatio || 1
      }
    );
    // This adds a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => map.getViewPort().resize());
    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // set map value
    setMap(map)
    setUi(ui);
  }

  // retrieve location once
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, [])

  // render map when location coordinates become available
  React.useEffect(() => {
    if (myLocation) {
      findMyLocation(myLocation);
    }
  }, [myLocation]);

  React.useEffect(() => {
    if (map && ui) {
      trySuggestPlaces(map, ui, myLocation);
    }
  }, [map, ui])

  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      <Typography variant="body1" style={{textAlign: "center"}}>Your minigolf location</Typography>
      <div ref={mapRef} style={{
        width: "100%",
        height: "50vh",
        margin: "10px auto",
        padding: 0
      }}></div>
    </Box>
  )
}