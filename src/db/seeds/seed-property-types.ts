import { db } from '..';
import { propertyType } from '../schemas/property-type-db-schema';
import { textSlugify } from '@/lib/slugify';

const TYPES = [
    { name: 'House', icon: 'home', description: 'Single-family detached home' },
    {
        name: 'Apartment',
        icon: 'building',
        description: 'Unit in a multi-unit building',
    },
    {
        name: 'Condo',
        icon: 'building-2',
        description: 'Individually owned unit in a shared complex',
    },
    {
        name: 'Townhouse',
        icon: 'rows',
        description: 'Multi-floor home sharing walls with neighbors',
    },
    {
        name: 'Villa',
        icon: 'palmtree',
        description: 'Large luxury home, often with a garden or pool',
    },
    {
        name: 'Duplex',
        icon: 'copy',
        description: 'Two-unit residential building',
    },
    {
        name: 'Studio',
        icon: 'door-open',
        description: 'Single-room living space',
    },
    { name: 'Land', icon: 'map', description: 'Vacant land or plot' },
    {
        name: 'Commercial',
        icon: 'store',
        description: 'Office, retail or other business property',
    },
];

export const seedPropertyTypes = async () => {
    await db
        .insert(propertyType)
        .values(
            TYPES.map((t, i) => ({
                name: t.name,
                slug: textSlugify(t.name),
                description: t.description,
                icon: t.icon,
                isActive: true,
                sortOrder: i,
            })),
        )
        .onConflictDoNothing();

    console.log(`Seeded ${TYPES.length} property types`);
};

seedPropertyTypes()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    });
