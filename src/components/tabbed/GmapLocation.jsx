import * as React from 'react';
import { AppContext } from '../../state/AppContext';
import { Paper, Typography } from '@mui/material';
import { APIProvider, Map, Marker, InfoWindow, useMap, useMarkerRef, useMapsLibrary } from '@vis.gl/react-google-maps';


export default function GmapLocation() {

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <MapComponent />
    </APIProvider>
  )
};

const MarkerWithInfoWindow = ({ position, title, image }) => {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = React.useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = React.useCallback(
    () => setInfoWindowShown(isShown => !isShown),
    []
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = React.useCallback(() => setInfoWindowShown(false), []);

  const icon = {
    url: image, // url
    scaledSize: new google.maps.Size(40, 40), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  return (
    <>
      <Marker
        ref={markerRef}
        position={position}
        icon={icon}
        onClick={handleMarkerClick}
      />

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <h2>Location Info</h2>
          <p>{title}</p>
        </InfoWindow>
      )}
    </>
  );
};

function MapComponent() {

  const map = useMap();
  const [placesService, setPlacesService] = React.useState(null);
  const { location, setLocation } = React.useContext(AppContext);
  const [myLocation, setMyLocation] = React.useState({ lat: null, lng: null });
  const [_, setSelected] = React.useState(null);

  const placesLibrary = useMapsLibrary('places');

  React.useEffect(() => {
    if (!placesLibrary || !map) return;

    // when placesLibrary is loaded, the library can be accessed via the
    // placesLibrary API object
    setPlacesService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  React.useEffect(() => {
    if (!placesService || !myLocation) return;

    const { lat, lng } = myLocation;
    var vicinity = new google.maps.LatLng(lat, lng);
    var request = {
      location: vicinity,
      query: 'golf, freesbie, minigolf near me'
    };

    placesService.textSearch(request, callback);

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK && results) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          createMarker(place);
        }
      }
    }

    function createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;

      const infowindow = new google.maps.InfoWindow();
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });

      google.maps.event.addListener(marker, "click", () => {
        const icon = {
          url: "src/assets/minigolf.png", // url
          scaledSize: new google.maps.Size(40, 40), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(10, 40) // anchor
        };

        infowindow.setContent(place.name || "");
        infowindow.open(map);

        //update marker icon
        marker.setIcon(icon);
        setSelected(prev => {
          prev?.setIcon(null);
          return marker;
      });

        //set selected golf location
        const { name, formatted_address, geometry: { location: { lat, lng } } } = place;
        setLocation({ name, address: formatted_address, lat: lat(), lng: lng() });
      });
    }
  }, [placesService, myLocation]);

  // retrieve myLocation once
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, []);

  return (
    <Paper component="section" elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" style={{ textAlign: "center" }}>{location ? location.name : "Tap on your location icon"}</Typography>
      <div style={{
        width: "100%",
        height: "50vh",
        margin: "10px auto",
        padding: 0
      }}>
        <Map defaultCenter={myLocation} defaultZoom={10} gestureHandling={'greedy'} disableDefaultUI={true} reuseMaps={true}>
          <MarkerWithInfoWindow position={myLocation} title={"This is your current location"} image={"src/assets/golfstick.png"} />
        </Map>
      </div>
    </Paper>
  )
}