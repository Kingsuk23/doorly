import { faker } from '@faker-js/faker';
import { hashPassword } from 'better-auth/crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { db } from '..';
import { user } from '../schemas/user-db-schema';
import { account } from '../schemas/account-db-schema'; // adjust path

const TOTAL = 200;
const ADMINS = 3;
const AGENTS = 25;

export const seedUsers = async () => {
    // roles: 3 admin, 25 agent, rest user (shuffled)
    const roles = faker.helpers.shuffle([
        ...Array(ADMINS).fill('admin'),
        ...Array(AGENTS).fill('agent'),
        ...Array(TOTAL - ADMINS - AGENTS).fill('user'),
    ]) as string[];

    const credentials: {
        name: string;
        email: string;
        password: string;
        role: string;
    }[] = [];
    const userRows: (typeof user.$inferInsert)[] = [];
    const accountRows: (typeof account.$inferInsert)[] = [];

    for (let i = 0; i < TOTAL; i++) {
        const first = faker.person.firstName();
        const last = faker.person.lastName();
        const name = `${first} ${last}`;
        // index in the email guarantees uniqueness
        const email = `${first}.${last}${i}@example.com`
            .toLowerCase()
            .replace(/[^a-z0-9.@]/g, '');
        const password =
            faker.internet.password({ length: 12, memorable: false }) + 'A1!';
        const role = roles[i];
        const id = faker.string.uuid();

        userRows.push({
            id,
            name,
            email,
            emailVerified: true,
            image: faker.image.avatar(),
            role,
            banned: false,
        });

        accountRows.push({
            id: faker.string.uuid(),
            accountId: id,
            providerId: 'credential',
            userId: id,
            password: await hashPassword(password),
        });

        credentials.push({ name, email, password, role });
    }

    await db.transaction(async (tx) => {
        await tx.insert(user).values(userRows);
        await tx.insert(account).values(accountRows);
    });

    await mkdir('seed-data', { recursive: true });
    await writeFile(
        'seed-data/users.json',
        JSON.stringify(credentials, null, 2),
    );

    console.log(`Seeded ${TOTAL} users (${ADMINS} admin, ${AGENTS} agent)`);
    console.log('Credentials saved to seed-data/users.json');
};

seedUsers()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    });
