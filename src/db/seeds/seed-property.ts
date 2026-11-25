import { faker } from '@faker-js/faker';
import { inArray } from 'drizzle-orm';
import { db } from '..';
import { user } from '../schemas/user-db-schema';
import { address } from '../schemas/address-db-schema';
import { property } from '../schemas/property-db-schema';
import { propertyType } from '../schemas/property-type-db-schema';
import { propertyMember } from '../schemas/property-member-db-schema'; // adjust path
import { propertyStepProgress } from '../schemas/property-step-progress-db-schema'; // adjust path

const MIN_PER_USER = 5;
const MAX_PER_USER = 10;

const STEPS = [
    'location_c',
    'layout_c',
    'parking_systems_c',
    'ownership_legal_c',
    'description_c',
    'review_publish_c',
] as const;

const chunk = <T>(arr: T[], size = 500) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size),
    );

export const seedProperties = async () => {
    // only users and agents own properties (admins are skipped)
    const owners = await db
        .select({ id: user.id, role: user.role })
        .from(user)
        .where(inArray(user.role, ['user', 'agent']));

    if (owners.length === 0)
        throw new Error('No users found. Run seed-users first.');

    const addresses = await db.select({ id: address.id }).from(address);
    if (addresses.length === 0)
        throw new Error('No addresses found. Run seed-broker first.');

    const types = await db.select({ id: propertyType.id }).from(propertyType);
    if (types.length === 0)
        throw new Error('No property types found. Seed property types first.');

    const propertyRows: (typeof property.$inferInsert)[] = [];
    const memberRows: (typeof propertyMember.$inferInsert)[] = [];
    const stepRows: (typeof propertyStepProgress.$inferInsert)[] = [];

    const usedKeys = new Set<string>(); // addressId:unit must be unique
    const usedAddresses = new Set<string>();

    for (const owner of owners) {
        const count = faker.number.int({
            min: MIN_PER_USER,
            max: MAX_PER_USER,
        });

        for (let n = 0; n < count; n++) {
            const id = faker.string.uuid();

            // pick an address + unit combo that is not used yet
            let addressId: string;
            let unit: string | null;
            do {
                addressId = faker.helpers.arrayElement(addresses).id;
                unit = usedAddresses.has(addressId)
                    ? String(faker.number.int({ min: 1, max: 999 }))
                    : null;
            } while (usedKeys.has(`${addressId}:${unit}`));
            usedKeys.add(`${addressId}:${unit}`);
            usedAddresses.add(addressId);

            const releaseStatus = faker.helpers.weightedArrayElement([
                { weight: 6, value: 'publish' as const },
                { weight: 3, value: 'draft' as const },
                { weight: 1, value: 'hidden' as const },
            ]);

            propertyRows.push({
                id,
                propertyTypeId: faker.helpers.arrayElement(types).id,
                addressId,
                ownerName: faker.person.fullName(),
                yearBuilt: faker.number.int({ min: 1950, max: 2024 }),
                bedrooms: faker.number.int({ min: 0, max: 6 }),
                bathrooms: String(
                    faker.number.int({ min: 1, max: 5 }) +
                        faker.helpers.arrayElement([0, 0.5]),
                ),
                livingAreaSqft: faker.number
                    .float({ min: 350, max: 6000, fractionDigits: 2 })
                    .toString(),
                lotSizeSqft: faker.number
                    .float({ min: 1000, max: 20000, fractionDigits: 2 })
                    .toString(),
                floors: faker.number.int({ min: 1, max: 4 }),
                unitNumber: unit,
                parkingSpaces: faker.number.int({ min: 0, max: 4 }),
                garageSpaces: faker.number.int({ min: 0, max: 3 }),
                heatingType: faker.helpers.arrayElement([
                    'Central',
                    'Electric',
                    'Gas',
                    'Heat pump',
                    'None',
                ]),
                coolingType: faker.helpers.arrayElement([
                    'Central AC',
                    'Window unit',
                    'Evaporative',
                    'None',
                ]),
                hoaName:
                    faker.helpers.maybe(
                        () => `${faker.location.street()} HOA`,
                        { probability: 0.3 },
                    ) ?? null,
                parcelNumber: `PCL-${faker.string.numeric(10)}`,
                zoning: faker.helpers.arrayElement([
                    'R1',
                    'R2',
                    'R3',
                    'C1',
                    'MU',
                ]),
                description: faker.lorem.paragraphs(2),
                releaseStatus,
            });

            memberRows.push({
                propertyId: id,
                userId: owner.id,
                role: 'owner',
                status: 'approved',
            });

            // published/hidden = all steps done, draft = partially done
            const doneCount =
                releaseStatus === 'draft'
                    ? faker.number.int({ min: 0, max: STEPS.length - 1 })
                    : STEPS.length;

            if (doneCount > 0) {
                stepRows.push({ propertyId: id, stepId: STEPS[doneCount - 1] });
            }
        }
    }

    await db.transaction(async (tx) => {
        for (const part of chunk(propertyRows))
            await tx.insert(property).values(part);
        for (const part of chunk(memberRows))
            await tx.insert(propertyMember).values(part);
        for (const part of chunk(stepRows))
            await tx.insert(propertyStepProgress).values(part);
    });

    console.log(
        `Seeded ${propertyRows.length} properties for ${owners.length} users/agents`,
    );
};

seedProperties()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    });
