import {Fragment, useEffect, useRef, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

export default function AirportInfo({ visible, setVisible, searchButton, icao, setSelectedAirport }) {
    let [airportInfo, setAirportInfo] = useState([]);

    useEffect(() => {
        if (!visible) return;
        if (icao == "") return;

        axios.request({
            method: 'GET',
            url: `https://airport-info.p.rapidapi.com/airport?icao=${icao}`,
            headers: {
                'X-RapidAPI-Key': 'b017861f42msh4e5e8f472ab1870p1e6c39jsn166b5da95fe8',
                'X-RapidAPI-Host': 'airport-info.p.rapidapi.com'
            }
        }).then(function (response) {
            setAirportInfo(response.data);

            setSelectedAirport({
                icao: response.data.icao,
                location: {
                    lon: response.data.longitude,
                    lat: response.data.latitude,
                },
                municipalityName: response.data.location,
                shortName: response.data.name
            });
        }).catch(function (error) {
            console.error(error);
        });
    }, [icao] );

    return (
        <Transition.Root show={visible} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setVisible}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <h2 id="slide-over-heading" className="text-lg font-medium text-gray-900">
                                                    Informations de l'a??roport
                                                </h2>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                                                        onClick={() => setVisible(false)}
                                                    >
                                                        <span className="sr-only">Fermer</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Main */}
                                        <div>
                                            <div className="pb-1 sm:pb-6">
                                                <div>
                                                    <div className="relative h-40 sm:h-56">
                                                        <img
                                                            className="absolute h-full w-full object-cover"
                                                            src="https://static3.depositphotos.com/1007330/265/i/600/depositphotos_2657408-stock-photo-plane-in-the-sky.jpg"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
                                                        <div className="sm:flex-1">
                                                            <div>
                                                                <div className="flex items-center">
                                                                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{airportInfo.name}</h3>
                                                                </div>
                                                                <p className="text-sm text-gray-500">@{airportInfo.icao}</p>
                                                            </div>
                                                            <div className="mt-5 flex flex-wrap space-y-3 sm:space-y-0 sm:space-x-3">
                                                                <a href={airportInfo.website} target="_blank"
                                                                   className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:flex-1"
                                                                >
                                                                    Site web
                                                                </a>
                                                                <a href={"https://www.google.com/maps/search/?api=1&query=" + airportInfo.latitude + "," + airportInfo.longitude} target="_blank"
                                                                   className="inline-flex w-full flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                >
                                                                    Ouvrir dans Google
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 pt-5 pb-5 sm:px-0 sm:pt-0">
                                                <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Adresse</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                            <p>
                                                                {airportInfo.street_number} {airportInfo.street} {airportInfo.postal_code} {airportInfo.city} {airportInfo.country}
                                                            </p>
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">T??l??phone</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{airportInfo.phone}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div className="ml-5 w-11/12 fixed bottom-5">
                                                <button
                                                  type="button"
                                                  className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:flex-1"
                                                  onClick={searchButton}
                                                >
                                                    Partir de cet a??roport
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
