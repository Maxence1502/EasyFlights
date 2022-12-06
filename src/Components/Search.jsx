import {useEffect, useState, Fragment} from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox, Transition, Listbox } from '@headlessui/react'
import axios from "axios";
import mapboxgl from 'mapbox-gl'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Search({ map, query, setQuery, searchButton, selectedAirport, setSelectedAirport, flightTime, selectedFlightTime, setSelectedFlightTime, allMapMarkers }) {
    let [matchingAirports, setMatchingAirpots] = useState([]);

    useEffect(() => {
        if (query.length < 3) {
            setMatchingAirpots([])
        } else {
            axios.request({
                method: 'GET',
                url: 'https://aerodatabox.p.rapidapi.com/airports/search/term',
                params: {
                    q: query,
                    limit: '25'
                },
                headers: {
                    'X-RapidAPI-Key': 'b017861f42msh4e5e8f472ab1870p1e6c39jsn166b5da95fe8',
                    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
                }
            }).then(function (response) {
                setMatchingAirpots(response.data.items);
            }).catch(function (error) {
                setMatchingAirpots([]);
            });
        }
    }, [query]);

    useEffect(() => {
        if (selectedAirport) {
            //console.log(selectedAirport.shortName);
            //query = selectedAirport.shortName;

            let marker = new mapboxgl.Marker({ color: "black", size: "large" })
              .setLngLat([selectedAirport.location.lon, selectedAirport.location.lat])
              .setPopup(
                new mapboxgl.Popup({offset: 25})
                  .setHTML(
                    `<h2>${selectedAirport.municipalityName}</h2><p>${selectedAirport.shortName}</p>`
                  )
              )
              .addTo(map.current);

            allMapMarkers.push(marker);

            const markerDiv = marker.getElement();
            markerDiv.addEventListener('mouseenter', () => { marker.togglePopup() });
            markerDiv.addEventListener('mouseleave', () => { marker.togglePopup() });
        }
    }, [selectedAirport]);

    return (
        <Combobox as="div" className="flex justify-between absolute w-1/2 top-10 left-1/4 transform -translateX-1/4" value={selectedAirport} onChange={setSelectedAirport}>
            <Combobox.Input
                className="w-full rounded-full border border-gray-300 bg-white py-4 pl-6 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => {setQuery(event.target.value);} }
                displayValue={(airport) => airport ? airport.name : query}
                placeholder={"Entrez le point de départ"}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>

            {matchingAirports.length > 0 && (
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {matchingAirports.map((airport) => (
                    <Combobox.Option
                      key={airport.icao}
                      value={airport}
                      className={({ active }) =>
                        classNames(
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                        )
                      }
                    >
                        {({ active, selected }) => (
                          <>
                              <div className="flex">
                                  <span className={classNames('truncate', selected && 'font-semibold')}>{airport.name}</span>
                                  <span
                                    className={classNames(
                                      'ml-2 truncate text-gray-500',
                                      active ? 'text-indigo-200' : 'text-gray-500'
                                    )}
                                  >
                                {airport.municipalityName}
                              </span>
                              </div>

                              {selected && (
                                <span
                                  className={classNames(
                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                    active ? 'text-white' : 'text-indigo-600'
                                  )}
                                >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                              )}
                          </>
                        )}
                    </Combobox.Option>
                  ))}
              </Combobox.Options>
            )}

            <Listbox value={selectedFlightTime} onChange={setSelectedFlightTime}>
                {({ open }) => (
                  <>
                      <div className="relative ml-2">
                          <Listbox.Button className="relative w-full h-full cursor-default rounded-full border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                              <span className="block truncate">{selectedFlightTime.name}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {flightTime.map((time) => (
                                    <Listbox.Option
                                      key={time.distance}
                                      className={({ active }) =>
                                        classNames(
                                          active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                          'relative cursor-default select-none py-2 pl-3 pr-9'
                                        )
                                      }
                                      value={time}
                                    >
                                        {({ selected, active }) => (
                                          <>
                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                              {time.name}
                                            </span>

                                              {selected ? (
                                                <span
                                                  className={classNames(
                                                    active ? 'text-white' : 'text-indigo-600',
                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                  )}
                                                >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                              </span>
                                              ) : null}
                                          </>
                                        )}
                                    </Listbox.Option>
                                  ))}
                              </Listbox.Options>
                          </Transition>
                      </div>
                  </>
                )}
            </Listbox>

            <button
              type="button"
              className="ml-2 inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={searchButton}
            >
                Rechercher
            </button>
        </Combobox>
    )
}
