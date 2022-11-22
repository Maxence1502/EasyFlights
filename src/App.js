import './App.css';
import Search from './Components/Search';
import AirportInfo from './Components/AirportInfo'
import React, {useEffect, useRef, useState} from 'react'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4ZW5jZTE1MDIiLCJhIjoiY2w4b2dodHc2MDg0bDNucnVmcTJ2Y3hpOCJ9.IHfK8wgoNngWo4MwghLWDg';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.07);
  const [lat, setLat] = useState(47,67);
  const [zoom, setZoom] = useState(5);
  const [airportInfoModal, airportInfoOpen] = useState(false);

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

    new mapboxgl.Marker()
      .setLngLat([2.35, 48.85])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h3>Paris</h3><p>Y'a la Tour Eiffel</p>`
          )
      )
      .addTo(map.current);

    new mapboxgl.Marker({ color: 'black' })
      .setLngLat([0, 51.5])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h3>London</h3><p>What a beautiful city</p>`
          )
      )
      .addTo(map.current);
  }, [] );

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(2));
      setLat(map.current.getCenter().lat.toFixed(2));
    });

    map.current.on('click', () => {
      console.log("clicked");
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
