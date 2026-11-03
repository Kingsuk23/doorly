import Logo from '@/components/icons/brand/Logo';
import { AGENT_ACCOUNT_BENEFITS } from '@/constants/agentAccountBenefits';
import Link from 'next/link';

const AgentBenefitsPanel = () => {
    return (
        <aside className="flex flex-col gap-10 bg-muted px-6 py-8 md:min-h-screen md:px-10 md:py-12 flex-1">
            <div className="flex flex-col gap-6">
                <Link
                    href="/"
                    aria-label="Home"
                    className="w-fit max-md:hidden"
                >
                    <Logo height={42} />
                </Link>
                <h1 className="max-w-md text-3xl font-bold leading-tight md:text-4xl">
                    Your Doorly agent account allows you to:
                </h1>
            </div>

            <ul className="flex flex-col gap-4">
                {AGENT_ACCOUNT_BENEFITS.map(
                    ({ icon: Icon, title, text, iconStyle }) => (
                        <li
                            key={title}
                            className="flex items-start gap-4 rounded-xl bg-background p-4 shadow-sm"
                        >
                            <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
                            >
                                <Icon className="size-5" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-lg font-semibold">{title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {text}
                                </p>
                            </div>
                        </li>
                    ),
                )}
            </ul>
        </aside>
    );
};

export default AgentBenefitsPanel;
