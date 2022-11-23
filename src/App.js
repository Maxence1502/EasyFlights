import './App.css';
import Search from './Components/Search';
import AirportInfo from './Components/AirportInfo'
import React, {useEffect, useRef, useState} from 'react'
import axios from "axios";

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4ZW5jZTE1MDIiLCJhIjoiY2w4b2dodHc2MDg0bDNucnVmcTJ2Y3hpOCJ9.IHfK8wgoNngWo4MwghLWDg';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.07);
  const [lat, setLat] = useState(47,67);
  const [zoom, setZoom] = useState(5);
  const [airportInfoModal, airportInfoOpen] = useState(false);
  let allMapMarkers = [];

  const searchButton = () => {
    airportInfoOpen(true);
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/maxence1502/cl8oguj5f005u15mtf3121ka1',
      center: [lng, lat],
      zoom: zoom
    });

    (map.current).addControl(new mapboxgl.NavigationControl(), "bottom-right");
    (map.current).addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      })
    );

    /*axios.request({
      method: 'GET',
      url: 'https://world-airports-directory.p.rapidapi.com/v1/airports',
      params: {page: '1', sortBy: 'name:asc', limit: '20'},
      headers: {
        'X-RapidAPI-Key': '57144c3fefmsha2412c30ecad75ep18d754jsnce65c801c15d',
        'X-RapidAPI-Host': 'world-airports-directory.p.rapidapi.com'
      }
    }).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });*/
  }, [] );

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(2));
      setLat(map.current.getCenter().lat.toFixed(2));
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    /*map.current.on('mouseenter', 'places', (e) => {
// Change the cursor style as a UI indicator.
      map.current.getCanvas().style.cursor = 'pointer';

// Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
    });

    map.current.on('mouseleave', 'places', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });*/

    map.current.on('click', (e) => {
      if (e) {
        axios.request({
          method: 'GET',
          url: `https://aerodatabox.p.rapidapi.com/airports/search/location/${e.lngLat.lat}/${e.lngLat.lng}/km/250/10`,
          params: {withFlightInfoOnly: 'true'},
          headers: {
            'X-RapidAPI-Key': '57144c3fefmsha2412c30ecad75ep18d754jsnce65c801c15d',
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
          }
        }).then(function (response) {
          allMapMarkers.forEach(marker => {
            marker.remove();
          });

          (response.data.items).forEach(airport => {
            allMapMarkers.push(new mapboxgl.Marker()
              .setLngLat([airport.location.lon, airport.location.lat])
              .setPopup(
                new mapboxgl.Popup({offset: 25})
                  .setHTML(
                    `<h2>${airport.municipalityName}</h2><p>${airport.name}</p>`
                  )
              )
              .addTo(map.current)
            );
          });
        }).catch(function (error) {
          console.error(error);
        });
      }
    });
  }, []);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat}
      </div>
      <div ref={mapContainer} className="map-container" />
      <Search searchButton={searchButton}/>
      <AirportInfo visible={airportInfoModal} setVisible={airportInfoOpen}/>
    </div>
  );
}

export default App;
