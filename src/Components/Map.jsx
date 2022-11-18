import '../index.css';
import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4ZW5jZTE1MDIiLCJhIjoiY2w4b2dodHc2MDg0bDNucnVmcTJ2Y3hpOCJ9.IHfK8wgoNngWo4MwghLWDg';

function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(4.07);
    const [lat, setLat] = useState(47,67);
    const [zoom, setZoom] = useState(5);


    const sayHello = () => {
        alert('You clicked me!');
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/maxence1502/cl8oguj5f005u15mtf3121ka1',
            center: [lng, lat],
            zoom: zoom
        });
    });

    return (
<div>
    <button onClick={sayHello}>Default</button>
    <div ref={mapContainer} className="map-container" />
</div>
    );
}

export default Map;
