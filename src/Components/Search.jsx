import {useRef, useState} from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import axios from "axios";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Search({ searchButton }) {
    const [query, setQuery] = useState('')
    const [selectedPerson, setSelectedPerson] = useState(null)
    let matchingAirports = [];

    const searchAirports = (search) => {
        if (search.length < 3) {
            matchingAirports = []
        } else {
            axios.request({
                method: 'GET',
                url: 'https://aerodatabox.p.rapidapi.com/airports/search/term',
                params: {
                    q: search,
                    limit: '25'
                },
                headers: {
                    'X-RapidAPI-Key': '57144c3fefmsha2412c30ecad75ep18d754jsnce65c801c15d',
                    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
                }
            }).then(function (response) {
                matchingAirports = response.data.items;
                console.log(matchingAirports);
            }).catch(function (error) {
                matchingAirports = [];
            });
        }
    }

    return (
        <Combobox as="div" className="flex justify-between absolute w-1/3 top-10 left-1/3 transform -translateX-1/3 " value={selectedPerson} onChange={setSelectedPerson}>
            <div className="relative mt-1 w-full">
                <Combobox.Input
                    className="w-full rounded-full border border-gray-300 bg-white py-4 pl-6 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    onChange={(event) => {setQuery(event.target.value)/*; searchAirports(event.target.value);*/} }
                    displayValue={(airport) => airport?.name}
                    placeholder={"Entrez le point de départ"}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>

                {console.log(matchingAirports.length)}
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
            </div>

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
