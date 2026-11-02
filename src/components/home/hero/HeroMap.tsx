'use client';

import Map, { Marker } from 'react-map-gl/maplibre';
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { HERO_PINS } from '@/constants/heroPin';
import MapPin from './MapPin';
import { useEffect, useState } from 'react';
import PropertyPopupCard from './PropertyPopupCard';

setWorkerUrl(
    new URL(
        'maplibre-gl/dist/maplibre-gl-worker.mjs',
        import.meta.url,
    ).toString(),
);

const HeroMap = () => {
    return (
        <Map
            initialViewState={{ longitude: 79, latitude: 22, zoom: 3.8 }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            scrollZoom={false}
            dragPan={false}
            attributionControl={false}
            style={{ width: '100%', height: '100%' }}
        >
            {HERO_PINS.map((pin) => (
                <Marker
                    key={pin.id}
                    latitude={pin.lat}
                    longitude={pin.lng}
                    anchor="center"
                >
                    <MapPin pin={pin} />
                </Marker>
            ))}

            <Marker
                latitude={HERO_PINS[2].lat}
                longitude={HERO_PINS[2].lng}
                offset={[-20, -70]}
            >
                <PropertyPopupCard pin={HERO_PINS[2]} />
            </Marker>
        </Map>
    );
};

export default HeroMap;
