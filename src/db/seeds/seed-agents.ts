import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { user } from '../schemas/user-db-schema';
import { broker } from '../schemas/broker-db-schema';
import { agent } from '../schemas/agent-db-schema'; // adjust path

export const seedAgents = async () => {
    const agentUsers = await db
        .select({ id: user.id, email: user.email })
        .from(user)
        .where(eq(user.role, 'agent'));

    if (agentUsers.length === 0) {
        throw new Error('No users with role "agent". Run seed-users first.');
    }

    const brokers = await db.select({ id: broker.id }).from(broker);
    if (brokers.length === 0) {
        throw new Error('No brokers found. Run seed-broker first.');
    }

    // only one "owner" is allowed per broker (unique partial index)
    const brokersWithOwner = new Set<string>();

    const rows: (typeof agent.$inferInsert)[] = agentUsers.map((u) => {
        // ~10% of agents are independent (no broker)
        const hasBroker = faker.number.int({ min: 1, max: 10 }) > 1;
        const brokerId = hasBroker
            ? faker.helpers.arrayElement(brokers).id
            : null;

        let brokerRole: 'owner' | 'agent' = 'agent';
        if (
            brokerId &&
            !brokersWithOwner.has(brokerId) &&
            faker.datatype.boolean(0.4)
        ) {
            brokerRole = 'owner';
            brokersWithOwner.add(brokerId);
        }

        return {
            userId: u.id,
            bio: faker.person.bio() + ' ' + faker.lorem.sentences(2),
            rate: faker.number.int({ min: 1, max: 5 }) * 50, // adjust to your meaning of "rate"
            brokerId,
            brokerRole,
            license: `AGT-${faker.string.alphanumeric(8).toUpperCase()}`,
            email: u.email, // same email as the user account
            phone: faker.phone.number(),
            website:
                faker.helpers.maybe(() => faker.internet.url(), {
                    probability: 0.6,
                }) ?? null,
            isVerified: faker.datatype.boolean(0.7),
        };
    });

    await db.insert(agent).values(rows).onConflictDoNothing();
    console.log(`Seeded ${rows.length} agents`);
};

seedAgents()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    });
