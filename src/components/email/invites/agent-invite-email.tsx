import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from 'react-email';

interface AgentInviteEmailProps {
    ownerName: string;
    propertyLabel: string;
    propertyAddress?: string;
    ownerMessage?: string;
    agentName?: string;
    expiryDate: string;
    logoUrl?: string;
}

const AgentInviteEmail = ({
    ownerName,
    propertyLabel,
    propertyAddress,
    agentName,
    ownerMessage,
    expiryDate,
    logoUrl,
}: AgentInviteEmailProps) => {
    return (
        <Html lang="en">
            <Head />
            <Preview>{ownerName} invited you to list a property</Preview>

            <Tailwind>
                <Body className="bg-zinc-100 py-6 font-sans">
                    <Container className="mx-auto max-w-120 rounded-xl bg-white p-8">
                        {logoUrl && (
                            <Img
                                src={logoUrl}
                                alt="Doorly"
                                height={24}
                                className="mb-6"
                            />
                        )}

                        <Heading className="m-0 mb-4 text-2xl font-bold text-zinc-900">
                            You&apos;ve been invited to list a property
                        </Heading>

                        <Text className="m-0 mb-3 text-[15px] leading-6 text-zinc-700">
                            Hi {agentName ?? 'there'},
                        </Text>
                        <Text className="m-0 mb-4 text-[15px] leading-6 text-zinc-700">
                            {ownerName} has invited you to be the listing agent
                            for a property:
                        </Text>

                        <Section className="mb-4 rounded-lg bg-zinc-50 p-4">
                            <Text className="m-0 text-[15px] font-semibold text-zinc-900">
                                {propertyLabel}
                            </Text>
                            {propertyAddress && (
                                <Text className="m-0 mt-1 text-[13px] text-zinc-600">
                                    {propertyAddress}
                                </Text>
                            )}
                        </Section>

                        {ownerMessage && (
                            <Text className="m-0 mb-4 border-l-4 border-zinc-200 pl-3 text-[14px] italic leading-5 text-zinc-600">
                                &ldquo;{ownerMessage}&rdquo;
                            </Text>
                        )}

                        <Text className="m-0 mb-5 text-[13px] leading-5 text-zinc-500">
                            Review the details and accept or decline. This
                            invitation expires on {expiryDate}.
                        </Text>

                        <Hr className="my-6 border-zinc-200" />

                        <Text className="m-0 text-xs leading-4.5 text-zinc-400">
                            You received this email because {ownerName} invited
                            you through Doorly. If you weren&apos;t expecting
                            this, you can safely ignore it.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default AgentInviteEmail;
