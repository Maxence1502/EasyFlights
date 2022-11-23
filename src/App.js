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
  const [query, setQuery] = useState('')
  const [lng, setLng] = useState(4.07);
  const [lat, setLat] = useState(47,67);
  const [zoom, setZoom] = useState(5);
  const [airportInfoModal, airportInfoOpen] = useState(false);
  let [allMapMarkers, setAllMapMarkers] = useState([]);

  const searchButton = () => {
    //airportInfoOpen(true);

    axios.request({
      method: 'GET',
      url: 'https://aerodatabox.p.rapidapi.com/airports/search/term',
      params: {
        q: query,
        limit: '1'
      },
      headers: {
        'X-RapidAPI-Key': '57144c3fefmsha2412c30ecad75ep18d754jsnce65c801c15d',
        'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
      }
    }).then(function (response) {
      if (response.data.items[0]) {
        axios.request({
          method: 'GET',
          url: `https://aerodatabox.p.rapidapi.com/airports/icao/${response.data.items[0].icao}/stats/routes/daily`,
          headers: {
            'X-RapidAPI-Key': '57144c3fefmsha2412c30ecad75ep18d754jsnce65c801c15d',
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
          }
        }).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
      } else {
        console.error("airport not found");
      }
    }).catch(function (error) {
      console.error(error);
    });
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/maxence1502/cl8oguj5f005u15mtf3121ka1',
      center: [lng, lat],
      zoom: zoom
    });

    (map.current).addControl(new mapboxgl.NavigationControl({
      showCompass: false
    }), "bottom-right");

    (map.current).addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      })
    );

    (map.current).dragRotate.disable();
    (map.current).touchZoomRotate.disableRotation();
  }, [] );

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('mousemove', (e) => {
      setLng(e.lngLat.lng.toFixed(2));
      setLat(e.lngLat.lat.toFixed(2));
    });

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
            let marker = new mapboxgl.Marker()
              .setLngLat([airport.location.lon, airport.location.lat])
              .setPopup(
                new mapboxgl.Popup({offset: 25})
                  .setHTML(
                    `<h2>${airport.municipalityName}</h2><p>${airport.name}</p>`
                  )
              )
              .addTo(map.current);

            allMapMarkers.push(marker);
            //setAllMapMarkers(allmapMarkers);

            const markerDiv = marker.getElement();
            markerDiv.addEventListener('mouseenter', () => { marker.togglePopup() });
            markerDiv.addEventListener('mouseleave', () => { marker.togglePopup() });
            markerDiv.addEventListener('click', () => { alert("Clicked"); });
          });

          setQuery("");
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
      <Search map={map} query={query} setQuery={setQuery} searchButton={searchButton} allMapMarkers={allMapMarkers} setAllMapMarkers={setAllMapMarkers}/>
      <AirportInfo visible={airportInfoModal} setVisible={airportInfoOpen}/>
    </div>
  );
}

export default App;
