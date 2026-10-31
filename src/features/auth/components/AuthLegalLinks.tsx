import Link from 'next/link';

const AuthLegalLinks = () => (
    <div className="flex gap-1 items-center">
        <Link
            href="/terms-of-service"
            className="text-xs text-muted-foreground underline"
        >
            Terms of Service
        </Link>
        <span className="size-1 bg-muted-foreground rounded-full" />
        <Link
            href="/privacy-policy"
            className="text-xs text-muted-foreground underline"
        >
            Privacy Policy
        </Link>
    </div>
);

export default AuthLegalLinks;
