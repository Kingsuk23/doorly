import { NextRequest } from 'next/server';

import { GeoapifyAutocompleteJSON } from '@/features/address/types';
import { respond, handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';

export async function GET(req: NextRequest) {
    try {
        const text = req.nextUrl.searchParams.get('text')?.trim() ?? '';

        if (text?.length < 3) {
            return respond(ok([]));
        }

        const apiKey = process.env.GEOAPIFY_KEY;

        if (!apiKey) {
            throw new AppError('INTERNAL_ERROR', 'Geocoding is not configured');
        }

        const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete');
        url.searchParams.set('text', text);
        url.searchParams.set('format', 'json');
        url.searchParams.set('limit', '5');
        url.searchParams.set('api_key', apiKey);

        const res = await fetch(url, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) {
            throw new AppError('UPSTREAM_ERROR', 'Geocoding failed');
        }

        const json: GeoapifyAutocompleteJSON = await res.json();

        const data = (json.results ?? []).map((p) => ({
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
            county: p.country,
        }));

        return respond(ok(data));
    } catch (error) {
        return respond(handleError(error));
    }
}
