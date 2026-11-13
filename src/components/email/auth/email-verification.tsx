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

import { APP_NAME } from '../constants/app_name';
import Logo from '@/components/icons/brand/logo';

type EmailVerificationProps = {
    name?: string;
    verifyUrl: string;
};

export const EmailVerification = ({
    name,
    verifyUrl,
}: EmailVerificationProps) => {
    return (
        <Html lang="en">
            <Head />
            <Preview>Verify your email to finish setting up {APP_NAME}</Preview>

            <Tailwind>
                <Body className="bg-zinc-100 py-6 font-sans">
                    <Container className="mx-auto max-w-120 rounded-xl bg-white p-8">
                        <Text className="m-0 mb-6">
                            <Logo height={24} />
                        </Text>

                        <Heading className="m-0 mb-4 text-2xl font-bold text-zinc-900">
                            Verify your email
                        </Heading>

                        <Text className="m-0 mb-3 text-[15px] leading-6 text-zinc-700">
                            Hi {name ?? 'there'},
                        </Text>
                        <Text className="m-0 mb-3 text-[15px] leading-6 text-zinc-700">
                            Thanks for signing up. Confirm your email address to
                            activate your account and start exploring
                            properties.
                        </Text>

                        <Section className="my-6 text-center">
                            <Button
                                href={verifyUrl}
                                className="rounded-lg bg-zinc-900 px-6 py-3 text-[15px] font-semibold text-white no-underline"
                            >
                                Verify email
                            </Button>
                        </Section>

                        <Text className="m-0 mb-1 text-[13px] text-zinc-500">
                            Button not working? Copy and paste this link into
                            your browser:
                        </Text>
                        <Link
                            href={verifyUrl}
                            className="break-all text-[13px] text-blue-600"
                        >
                            {verifyUrl}
                        </Link>

                        <Hr className="my-6 border-zinc-200" />

                        <Text className="m-0 text-xs leading-4.5 text-zinc-400">
                            If you didn’t create an account, you can safely
                            ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default EmailVerification;
