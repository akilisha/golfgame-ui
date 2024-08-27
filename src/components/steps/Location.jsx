import * as React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

export default function Location() {

  const mapRef = React.useRef(null);
  const [places, setPlaces] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPlaces(list => ([...list, { lat: position.coords.latitude, lng: position.coords.longitude }]));
      });
    }
  }, [])

  return (
    <APIProvider apiKey={import.meta.env.VITE_MAP_API_KEY}>
      <div ref={mapRef} style={{
        width: "100%",
        height: "400px",
        margin: "40px auto",
        padding: 0
      }}>
        <Map zoom={12} center={places[0]} mapId={import.meta.env.VITE_GOOGLE_MAP_ID}>
          <AdvancedMarker position={places[0]} onClick={() => setOpen(true)}>
            <Pin />
            {open && <InfoWindow position={places[0]} onCloseClick={() => setOpen(false)}><p>My Diggs</p></InfoWindow>}
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>


  )
}