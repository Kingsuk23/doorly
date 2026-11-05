import { GeoapifyAutocompleteJSON } from '@/features/address/type/address';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const lat = Number(req.nextUrl.searchParams.get('lat'));
    const lon = Number(req.nextUrl.searchParams.get('lon'));

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return NextResponse.json(
            { error: 'Invalid coordinates' },
            { status: 400 },
        );
    }

    const url = new URL('https://api.geoapify.com/v1/geocode/reverse');

    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('format', 'json');
    url.searchParams.set('api_key', process.env.GEOAPIFY_KEY!);

    const res = await fetch(url);

    if (!res.ok) {
        return NextResponse.json(
            { error: 'Reverse geocoding failed' },
            { status: 502 },
        );
    }

    const data = await res.json();

    const formattedData = {
        country: data.results[0].country,
        country_code: data.results[0].country_code,
        state_code: data.results[0].state_code,
        state: data.results[0].state,
    };

    return NextResponse.json({ data: formattedData }, { status: 200 });
}
