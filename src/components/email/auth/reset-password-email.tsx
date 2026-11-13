import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from 'react-email';

import Logo from '@/components/icons/brand/logo';
import { APP_NAME } from '../constants/app_name';

type ResetPasswordEmailProps = {
    name?: string;
    resetUrl: string;
    expiresInMinutes?: number;
};

export const ResetPasswordEmail = ({
    name,
    resetUrl,
    expiresInMinutes = 10,
}: ResetPasswordEmailProps) => {
    return (
        <Html lang="en">
            <Head />
            <Preview>Reset your {APP_NAME} password</Preview>

            <Tailwind>
                <Body className="bg-zinc-100 py-6 font-sans">
                    <Container className="mx-auto max-w-120 rounded-xl bg-white p-8">
                        <Text className="m-0 mb-6 text-lg font-bold text-zinc-900">
                            <Logo height={24} />
                        </Text>

                        <Heading className="m-0 mb-4 text-2xl font-bold text-zinc-900">
                            Reset your password
                        </Heading>

                        <Text className="m-0 mb-3 text-[15px] leading-6 text-zinc-700">
                            Hi {name ?? 'there'},
                        </Text>
                        <Text className="m-0 mb-3 text-[15px] leading-6 text-zinc-700">
                            We received a request to reset the password for your
                            account. Click the button below to choose a new one.
                        </Text>

                        <Section className="my-6 text-center">
                            <Button
                                href={resetUrl}
                                className="rounded-lg bg-zinc-900 px-6 py-3 text-[15px] font-semibold text-white no-underline"
                            >
                                Reset password
                            </Button>
                        </Section>

                        <Text className="m-0 mb-3 text-[13px] leading-5 text-zinc-500">
                            This link expires in {expiresInMinutes} minutes and
                            can only be used once.
                        </Text>

                        <Text className="m-0 mb-1 text-[13px] text-zinc-500">
                            Button not working? Copy and paste this link into
                            your browser:
                        </Text>
                        <Link
                            href={resetUrl}
                            className="break-all text-[13px] text-blue-600"
                        >
                            {resetUrl}
                        </Link>

                        <Hr className="my-6 border-zinc-200" />

                        <Text className="m-0 text-xs leading-4.5 text-zinc-400">
                            If you didn’t request a password reset, you can
                            safely ignore this email. Your password won’t
                            change.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ResetPasswordEmail;
