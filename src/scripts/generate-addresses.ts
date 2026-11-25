// scripts/generate-addresses.ts  (run: npx tsx scripts/generate-addresses.ts)
import { faker } from '@faker-js/faker';
import { mkdir, writeFile } from 'node:fs/promises';

const API_KEY = process.env.GEOAPIFY_KEY!;
const TARGET = 100;

// Anchors only decide WHERE to sample; the address data comes from Geoapify
const CENTERS = [
    { lat: 37.7749, lon: -122.4194 }, // San Francisco
    { lat: 40.7128, lon: -74.006 }, // New York
    { lat: 30.2672, lon: -97.7431 }, // Austin
    { lat: 41.8781, lon: -87.6298 }, // Chicago
    { lat: 43.6532, lon: -79.3832 }, // Toronto
    { lat: 51.5074, lon: -0.1278 }, // London
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function reverse(lat: number, lon: number) {
    const url = new URL('https://api.geoapify.com/v1/geocode/reverse');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('format', 'json');
    url.searchParams.set('apiKey', API_KEY);
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json.results?.[0] ?? null;
}

async function main() {
    const rows: unknown[] = [];
    const seen = new Set<string>();
    let attempts = 0;

    while (rows.length < TARGET && attempts < TARGET * 10) {
        attempts++;
        const center = faker.helpers.arrayElement(CENTERS);
        const [lat, lon] = faker.location.nearbyGPSCoordinate({
            origin: [center.lat, center.lon],
            radius: 8,
            isMetric: true,
        });

        const p = await reverse(lat, lon);
        await sleep(250); // stay under the free-tier rate limit

        // keep only complete, real addresses
        if (
            !p?.housenumber ||
            !p.street ||
            !p.city ||
            !p.state ||
            !p.postcode ||
            !p.country_code
        )
            continue;
        if (seen.has(p.place_id)) continue;
        seen.add(p.place_id);

        rows.push({
            country_name: p.country,
            country_code: p.country_code.toUpperCase(),
            state_name: p.state,
            state_code: p.state_code ?? p.state.slice(0, 2).toUpperCase(),
            city_name: p.city,
            zip_code: p.postcode,
            street_address_1: `${p.housenumber} ${p.street}`,
            street_address_2:
                faker.helpers.maybe(() => faker.location.secondaryAddress(), {
                    probability: 0.2,
                }) ?? null,
            latitude: p.lat, // use Geoapify's snapped coordinates, not the random ones
            longitude: p.lon,
        });
        console.log(`${rows.length}/${TARGET} ${p.formatted}`);
    }

    await mkdir('seed-data', { recursive: true });
    await writeFile('seed-data/addresses.json', JSON.stringify(rows, null, 2));
    console.log(`Wrote ${rows.length} addresses`);
}

main();
