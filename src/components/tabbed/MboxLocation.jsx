import * as React from 'react';
import { AppContext } from '../../state/AppContext';
import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
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
  const [, setSelectedLocationIcon] = React.useState(null);
  const { location, setLocation } = React.useContext(AppContext);

  function swapIcons({ target: el }) {
    setSelectedLocationIcon(prev => {
      if (prev) {
        prev.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEWklEQVR4nO2Y22sjVRzHz859MtEHWaj4oCCKb253pzPnnHkpCIugD4s3BGF9VQT1b9B37yu+uGrZXZTibXe9bJK2aZukaZM0TSYd3Yggiy9Wt90Ftbvdh/zkN22XuOjcmkQD/cGXDATC53vmd37ne0LIfu3XfvWkmg55wOXCS64jTjYdodVk4pUGF6HBJVjh0tU6F906lz6pcenlZabeR/4PVTOJ3GLCs64jVFxHBFQT5YPfhIf6jpZ9yVBDMblS4fJx/I3/BN7l4qMuF35sOQLEhucyVHdU4XK7SpVHBgbeOEqMFj/wEYLvHV6BClNgCUWV9xsPEqOv8C4lIy0urPQcnimwyBQoM7VapsZIX+BXLXJniwvtfsEvMhUNQImp7Z6bWB0n6ZYjLPcbfmFHRarWayZJ9c6Ac+DkoOBLvjQoUu1kz6bNwOHZtua4+vCe4HFGu47wQxz4MpUhNybDN6YE545s6ytThoypQMGODl9AUa09+RQRExtoceF4VPglJkHGlCH75CFYnXgT1r5rwJ9XN3zhc2viDfj28UO+mSKNBA/zVIdZS3smsQHXEZaiwJepBF8zA7wzJ+D6tWuwtbX1j7q+uQmrp0/Al3YaZu1w+Hk0YOulRPAeJfdHXXmE/7mU+1fwW3WpmIUv7DTM0WD4OTRA9U5hTL03yeq/GKXnsW28M+9Ght+Ve+odOGeqgfA7BiBv6c8nMCB+HGXDYs8HtU1QO51/bBRm7GD4WZqCGVs/FdtAgwuNsFGJ0wY3bFz4XTU+fB3Om2ogfH5btQQGxPWwOY+j8tfvm4kN/OKtwOeH1TB4fANrSQzcCDukcMb/cWU9sYHfNy7D5KgWDE9TME1TWwkMSDfCTljfwMbl5AbWf/MNhMDDlG1sxjZQ59J6WDzAQ2ltjy306WEtEH6aGjBlp+K30DITV8KyDcYDPGGTGlj54DU4e0QLhvcNGJX4Brh0OiyYYbbBeIAjMckYPXtsFLJWKDxkLWMitoEal16IkiqxjTAexB6hE2/BZ/7qB8PnbPzUn0vwBrR7qlzuhEViDGaYbS4VM5Hhf5rPwOTYbdjbofBZ2+jkTO3u2Ab8t8DkUpQ8j8EMsw3Gg6B2wu9w5RE+a4XD52wDMpZRIEmrQuWno15GMJhhtsF4gCcsThg8I1D47G/YY6N+20RZ+Zy/+mnI0fQTiQ3kx4lU4bIX5yaF2QbjAZ6wOONROCpx2kTZsLku+IyVbu7pQoNVperRRaZ0Yt6kwuNBGLyd7mRs4yHSi1qkynuDhM9uG3ib9KoWGNHLTCkPDt4o5ceJRnpZNTN9cIGqFwcAfzFvpg+SfhT+Y1Ziqtcv+Au20c46+l19ge82UWSaN5Tw3SYKTPOGEr7bxBzVvaGE360paozMUt0bSvhuE3mqe0MJf6uJoYTvNjFDdW8o4btNTNOUN5Tw3SZyVsobSvhuE1kr5Q0l/G5dYLffkbWNVzOW8Qo+3/xiv8jf6i/Cn0Zfz4czKQAAAABJRU5ErkJggg==";
      }
      el.src = "data:image/png;base64,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";
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
        el.src = "data:image/png;base64,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";
        el.style.width = "35px";
        el.style.height = "35px";
        el.style.backgroundSize = '100%';

        const marker = new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates);
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<div>${feature.properties.full_address}</div>`
            )
        )

        marker.addTo(map);  // Replace this line with code from step 5-2
        //update my-location
        const [newLng, newLat] = feature.geometry.coordinates;
        setMyLocation(l => ({ ...l, lat: newLat, lng: newLng }))
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
          el.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEWklEQVR4nO2Y22sjVRzHz859MtEHWaj4oCCKb253pzPnnHkpCIugD4s3BGF9VQT1b9B37yu+uGrZXZTibXe9bJK2aZukaZM0TSYd3Yggiy9Wt90Ftbvdh/zkN22XuOjcmkQD/cGXDATC53vmd37ne0LIfu3XfvWkmg55wOXCS64jTjYdodVk4pUGF6HBJVjh0tU6F906lz6pcenlZabeR/4PVTOJ3GLCs64jVFxHBFQT5YPfhIf6jpZ9yVBDMblS4fJx/I3/BN7l4qMuF35sOQLEhucyVHdU4XK7SpVHBgbeOEqMFj/wEYLvHV6BClNgCUWV9xsPEqOv8C4lIy0urPQcnimwyBQoM7VapsZIX+BXLXJniwvtfsEvMhUNQImp7Z6bWB0n6ZYjLPcbfmFHRarWayZJ9c6Ac+DkoOBLvjQoUu1kz6bNwOHZtua4+vCe4HFGu47wQxz4MpUhNybDN6YE545s6ytThoypQMGODl9AUa09+RQRExtoceF4VPglJkHGlCH75CFYnXgT1r5rwJ9XN3zhc2viDfj28UO+mSKNBA/zVIdZS3smsQHXEZaiwJepBF8zA7wzJ+D6tWuwtbX1j7q+uQmrp0/Al3YaZu1w+Hk0YOulRPAeJfdHXXmE/7mU+1fwW3WpmIUv7DTM0WD4OTRA9U5hTL03yeq/GKXnsW28M+9Ght+Ve+odOGeqgfA7BiBv6c8nMCB+HGXDYs8HtU1QO51/bBRm7GD4WZqCGVs/FdtAgwuNsFGJ0wY3bFz4XTU+fB3Om2ogfH5btQQGxPWwOY+j8tfvm4kN/OKtwOeH1TB4fANrSQzcCDukcMb/cWU9sYHfNy7D5KgWDE9TME1TWwkMSDfCTljfwMbl5AbWf/MNhMDDlG1sxjZQ59J6WDzAQ2ltjy306WEtEH6aGjBlp+K30DITV8KyDcYDPGGTGlj54DU4e0QLhvcNGJX4Brh0OiyYYbbBeIAjMckYPXtsFLJWKDxkLWMitoEal16IkiqxjTAexB6hE2/BZ/7qB8PnbPzUn0vwBrR7qlzuhEViDGaYbS4VM5Hhf5rPwOTYbdjbofBZ2+jkTO3u2Ab8t8DkUpQ8j8EMsw3Gg6B2wu9w5RE+a4XD52wDMpZRIEmrQuWno15GMJhhtsF4gCcsThg8I1D47G/YY6N+20RZ+Zy/+mnI0fQTiQ3kx4lU4bIX5yaF2QbjAZ6wOONROCpx2kTZsLku+IyVbu7pQoNVperRRaZ0Yt6kwuNBGLyd7mRs4yHSi1qkynuDhM9uG3ib9KoWGNHLTCkPDt4o5ceJRnpZNTN9cIGqFwcAfzFvpg+SfhT+Y1Ziqtcv+Au20c46+l19ge82UWSaN5Tw3SYKTPOGEr7bxBzVvaGE360paozMUt0bSvhuE3mqe0MJf6uJoYTvNjFDdW8o4btNTNOUN5Tw3SZyVsobSvhuE1kr5Q0l/G5dYLffkbWNVzOW8Qo+3/xiv8jf6i/Cn0Zfz4czKQAAAABJRU5ErkJggg==";
          el.style.width = "35px";
          el.style.height = "35px";
          el.style.backgroundSize = '100%';
          el.cursor = 'pointer'
          el.addEventListener('click', function (ev) {
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
        {!map && (
          <Stack sx={{ display: 'flex', justifyContent: 'center', color: 'grey.500', alignContent: 'center', pt: 5 }} spacing={2} direction="row">
            <CircularProgress />
            <Typography component={"div"} variant='h5'>Loading map...</Typography>
          </Stack>)
        }
      </div>
    </Box>
  )
}