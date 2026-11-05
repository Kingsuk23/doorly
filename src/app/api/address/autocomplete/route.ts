import { GeoapifyAutocompleteJSON } from '@/features/address/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const text = searchParams.get('text')?.trim() ?? '';

    if (text?.length < 3) {
        return NextResponse.json({ result: [] }, { status: 200 });
    }

    const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete');

    url.searchParams.set('text', text);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '5');
    url.searchParams.set('api_key', process.env.GEOAPIFY_KEY!);

    const res = await fetch(url, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        return NextResponse.json(
            { error: 'Geocoding failed' },
            { status: 502 },
        );
    }

    const data: GeoapifyAutocompleteJSON = await res.json();

    const result = data.results.map((p) => {
        return {
            placeId: p.place_id,
            formatted: p.formatted,
            street: [p.housenumber, p.street].filter(Boolean).join(' '),
            city: p.city,
            state: p.state,
            postcode: p.postcode,
            country: p.country,
            countryCode: p.country_code?.toUpperCase(),
            stateCode: p.state_code,
            lat: p.lat,
            lon: p.lon,
            resultType: p.result_type,
        };
    });

    return NextResponse.json({ result }, { status: 200 });
}
