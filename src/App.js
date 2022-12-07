import './App.css';
import Search from './Components/Search';
import AirportInfo from './Components/AirportInfo'
import React, {useEffect, useRef, useState} from 'react'
import axios from "axios";

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4ZW5jZTE1MDIiLCJhIjoiY2w4b2dodHc2MDg0bDNucnVmcTJ2Y3hpOCJ9.IHfK8wgoNngWo4MwghLWDg';

const flightTime = [
    { distance: 500, name: '< 1h' },
    { distance: 1200, name: '< 2h' },
    { distance: 3600, name: '< 5h' },
    { distance: 14000, name: '> 5h' }
]

function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    let [lng, setLng] = useState(4.07);
    let [lat, setLat] = useState(47,67);
    let [zoom, setZoom] = useState(5);
    let [query, setQuery] = useState('');
    let [selectedAirport, setSelectedAirport] = useState(null)
    let [airportInfoModal, airportInfoOpen] = useState(false);
    let [allMapMarkers, setAllMapMarkers] = useState([]);
    let [selectedICAO, setSelectedICAO] = useState("");
    let [selectedFlightTime, setSelectedFlightTime] = useState(flightTime[3]);

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371;
        var dLat = deg2rad(lat2-lat1);
        var dLon = deg2rad(lon2-lon1);
        var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    const searchButton = () => {
        axios.request({
            method: 'GET',
            url: 'https://aerodatabox.p.rapidapi.com/airports/search/term',
            params: {
                q: selectedAirport.icao,
                limit: '1'
            },
            headers: {
                'X-RapidAPI-Key': 'b017861f42msh4e5e8f472ab1870p1e6c39jsn166b5da95fe8',
                'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
            }
        }).then(function (response) {
            let currentAirport = response.data.items[0];

            if (currentAirport) {
                axios.request({
                  method: 'GET',
                  url: `https://aerodatabox.p.rapidapi.com/airports/icao/${currentAirport.icao}/stats/routes/daily`,
                  headers: {
                    'X-RapidAPI-Key': 'b017861f42msh4e5e8f472ab1870p1e6c39jsn166b5da95fe8',
                    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
                  }
                }).then(function (response) {
                  allMapMarkers.forEach(marker => {
                    marker.remove();
                  });

                  let marker = new mapboxgl.Marker({ color: "black", size: "large" })
                    .setLngLat([currentAirport.location.lon, currentAirport.location.lat])
                    .setPopup(
                      new mapboxgl.Popup({offset: 25})
                        .setHTML(
                          `<h2>${currentAirport.municipalityName}</h2><p>${currentAirport.shortName}</p>`
                        )
                    )
                    .addTo(map.current);

                  allMapMarkers.push(marker);

                  const markerDiv = marker.getElement();
                  markerDiv.addEventListener('mouseenter', () => { marker.togglePopup() });
                  markerDiv.addEventListener('mouseleave', () => { marker.togglePopup() });

                  let routesFeatures = [];

                  (response.data.routes).forEach(route => {
                    if (route.destination.location) {
                      var distance = getDistanceFromLatLonInKm(
                        currentAirport.location.lat, currentAirport.location.lon,
                        route.destination.location.lat, route.destination.location.lon
                      )

                        //console.log(route.destination.name + " : " + currentAirport.location.lat + " " + currentAirport.location.lon + " | " + route.destination.location.lat + " " + route.destination.location.lon + " > " + distance);

                        if (distance <= selectedFlightTime.distance) {
                            let red = (distance / selectedFlightTime.distance) * 256;
                            let green = 34;
                            let blue = 34;

                            let marker = new mapboxgl.Marker({ color: ("#" + (1 << 24 | red << 16 | green << 8 | blue).toString(16).slice(1)) })
                                .setLngLat([route.destination.location.lon, route.destination.location.lat])
                                .setPopup(
                                    new mapboxgl.Popup({offset: 25})
                                        .setHTML(
                                            `<h2>${route.destination.municipalityName}</h2><p>${route.destination.name}</p>`
                                        )
                                )
                                .addTo(map.current);

                            allMapMarkers.push(marker);

                            const markerDiv = marker.getElement();
                            markerDiv.addEventListener('mouseenter', () => { marker.togglePopup() });
                            markerDiv.addEventListener('mouseleave', () => { marker.togglePopup() });
                            markerDiv.addEventListener('click', () => { alert("Clicked"); });

                            routesFeatures.push({
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': [
                                        [currentAirport.location.lon, currentAirport.location.lat],
                                        [route.destination.location.lon, route.destination.location.lat]
                                    ]
                                }
                            })
                        }
                    }
                  });

                  var mapLayer = (map.current).getLayer('route');
                  if (typeof mapLayer !== 'undefined') {
                    (map.current).removeLayer('route').removeSource('route');
                  }

                  (map.current).addSource('route', {
                    'type': 'geojson',
                    'data': {
                      'type': 'FeatureCollection',
                      'features': routesFeatures
                    }
                  });

                  (map.current).addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                      'line-join': 'round',
                      'line-cap': 'round'
                    },
                    'paint': {
                      'line-color': '#888',
                      'line-width': 2,
                      'line-dasharray': [2,4]
                    }
                  });
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
        if (map.current) return;
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
        if (!map.current) return;
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
                        'X-RapidAPI-Key': 'b017861f42msh4e5e8f472ab1870p1e6c39jsn166b5da95fe8',
                        'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
                    }
                }).then(function (response) {
                    var mapLayer = (map.current).getLayer('route');
                    if (typeof mapLayer !== 'undefined') {
                        (map.current).removeLayer('route').removeSource('route');
                    }

                    allMapMarkers.forEach(marker => {
                        marker.remove();
                    });

                    setQuery("");

                    (response.data.items).forEach(airport => {
                        let marker = new mapboxgl.Marker({ color: "black" })
                            .setLngLat([airport.location.lon, airport.location.lat])
                            .setPopup(
                                new mapboxgl.Popup({offset: 25})
                                    .setHTML(
                                        `<h2>${airport.municipalityName}</h2><p>${airport.name}</p>`
                                    )
                            )
                            .addTo(map.current);

                        allMapMarkers.push(marker);

                        const markerDiv = marker.getElement();
                        markerDiv.addEventListener('mouseenter', () => { marker.togglePopup() });
                        markerDiv.addEventListener('mouseleave', () => { marker.togglePopup() });
                        markerDiv.addEventListener('click', () => { airportInfoOpen(true); setQuery(airport.name); setSelectedICAO(airport.icao); });
                    });
                }).catch(function (error) {
                    console.error(error);
                });
            }
        });
    }, []);

    return (
        <div>
            <img
                className="absolute z-50 mt-10 ml-10 max-w-[250px] invisible lg:visible"
                src="logo.png"
                alt=""
            />
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat}
            </div>
            <div ref={mapContainer} className="map-container" />
            <Search map={map} query={query} setQuery={setQuery} searchButton={searchButton} selectedAirport={selectedAirport} setSelectedAirport={setSelectedAirport} flightTime={flightTime} selectedFlightTime={selectedFlightTime} setSelectedFlightTime={setSelectedFlightTime} allMapMarkers={allMapMarkers}/>
            <AirportInfo visible={airportInfoModal} setVisible={airportInfoOpen} searchButton={searchButton} icao={selectedICAO} setSelectedAirport={setSelectedAirport}/>
        </div>
    );
}

export default App;
