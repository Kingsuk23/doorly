import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acme.com';

type StaticRoute = {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/buy', changeFrequency: 'daily', priority: 0.9 },
    { path: '/rent', changeFrequency: 'daily', priority: 0.9 },
    { path: '/sell', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/mortgage', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/agents', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/feed', changeFrequency: 'daily', priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
        url: `${BASE_URL}${r.path}`,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));

    // Dynamic pages from your database (add these once the tables exist)
    // const properties = await getAllPropertySlugs();
    // const propertyEntries = properties.map((p) => ({
    //     url: `${BASE_URL}/properties/${p.slug}`,
    //     lastModified: p.updatedAt,
    //     changeFrequency: 'daily' as const,
    //     priority: 0.8,
    // }));

    return [...staticEntries /*, ...propertyEntries */];
}
