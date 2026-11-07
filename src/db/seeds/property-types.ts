import { textSlugify } from '@/lib/slugify';
import { db } from '..';
import { propertyType } from '../schema/propertyType';

const propertyTypesSeed = [
    {
        name: 'single family',
        sortOrder: 0,
        description:
            'A standalone home built on its own lot, designed for one household. Usually includes a private yard and no shared walls.',
        icon: 'house',
    },
    {
        name: 'condo',
        sortOrder: 1,
        description:
            'A unit in a larger building or complex where you own the interior and share common areas such as hallways, pool, and gym. Usually has monthly HOA fees.',
        icon: 'building2',
    },
    {
        name: 'townhouse',
        sortOrder: 2,
        description:
            'A multi-story home that shares one or more walls with neighboring units. Typically has its own entrance and a small yard or patio, often with HOA fees.',
        icon: 'warehouse',
    },
    {
        name: 'multi family',
        sortOrder: 3,
        description:
            'A building with two or more separate living units, such as a duplex, triplex, or fourplex. Popular with investors and owners who want rental income.',
        icon: 'building',
    },
    {
        name: 'apartment',
        sortOrder: 4,
        description:
            'A rental or owner-occupied unit within a larger residential building, managed by a landlord or property company.',
        icon: 'hotel',
    },
    {
        name: 'mobile',
        sortOrder: 5,
        description:
            'A home built in a factory and transported to a site. May sit on owned land or in a leased lot within a mobile home community.',
        icon: 'caravan',
    },
    {
        name: 'land',
        sortOrder: 6,
        description:
            'Undeveloped or vacant property with no house on it. Can be used for building, farming, or investment.',
        icon: 'land plot',
    },
    {
        name: 'farm',
        sortOrder: 7,
        description:
            'Large rural property used for agriculture, livestock, or recreation. Often includes a main house, barns, and acreage.',
        icon: 'tractor',
    },
];

const seedPropertyTypes = async () => {
    console.log('start seed');
    for (const t of propertyTypesSeed) {
        const slug = textSlugify(t.name);
        await db.insert(propertyType).values({
            name: t.name,
            icon: t.icon,
            slug: slug,
            sortOrder: t.sortOrder,
            description: t.description,
        });
    }
    console.log('end seed');
};

seedPropertyTypes();
