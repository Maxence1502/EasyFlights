import { useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import axios from "axios";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Search() {
    const [query, setQuery] = useState('')
    const [selectedPerson, setSelectedPerson] = useState(null)

    const searchAirports = (search) => {
        const options = {
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
        };

        return axios.request(options).then(function (response) {
            console.log(response.data.items);
            return response.data.items;
        }).catch(function (error) {
            return [];
        });
    }

    const filteredAirports =
        query.length < 3
            ? []
            : searchAirports(query)

    return (
        <Combobox as="div" className="absolute w-1/3 top-10 left-1/3 transform -translateX-1/3 " value={selectedPerson} onChange={setSelectedPerson}>
            <div className="relative mt-1">
                <Combobox.Input
                    className="w-full rounded-full border border-gray-300 bg-white py-4 pl-6 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(person) => person?.name || "Search"}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>

                {filteredAirports.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredAirports.map((airport) => (
                            <Combobox.Option
                                key={airport.icao}
                                value={airport}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-2 pl-8 pr-4',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span className={classNames('block truncate', selected && 'font-semibold')}>{airport.name}</span>

                                        {selected && (
                                            <span
                                                className={classNames(
                                                    'absolute inset-y-0 left-0 flex items-center pl-1.5',
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
        </Combobox>
    )
}