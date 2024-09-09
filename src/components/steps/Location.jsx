import * as React from 'react';
import { AppContext } from '../../state/AppContext';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const MyComponent = () => {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;

    // here you can interact with the imperative maps API
  }, [map]);

  return <></>;
};


export default function Location() {

  const [myLocation, setMyLocation] = React.useState(null);
  const [placesService, setPlacesService] = React.useState(null);
  const { setLocation } = React.useContext(AppContext);

  const map = useMap();

  const placesLibrary = useMapsLibrary('places');

  React.useEffect(() => {
    if (!placesLibrary || !map) return;

    // when placesLibrary is loaded, the library can be accessed via the
    // placesLibrary API object
    setPlacesService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  React.useEffect(() => {
    if (!placesService) return;

    const { lat, lng } = myLocation;
    var vicinity = new google.maps.LatLng(-lat, lng);
    var request = {
      location: vicinity,
      radius: '10000',
      query: 'minigolf near me'
    };
    placesService.textSearch(request, callback);
    service.textSearch(request, callback);

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          createMarker(place);
        }
      }
    }
  }, [placesService]);

  // retrieve location once
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, []);

  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      <Typography variant="body1" style={{ textAlign: "center" }}>Your minigolf location</Typography>
      <div style={{
        width: "100%",
        height: "50vh",
        margin: "10px auto",
        padding: 0
      }}>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map center={myLocation} zoom={10}>
            <Marker position={myLocation} />
          </Map>
          <MyComponent />
        </APIProvider>
      </div>
    </Box>
  )
}