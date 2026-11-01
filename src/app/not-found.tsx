import Link from 'next/link';
import { Home, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import LogoType from '@/components/svg/brand/LogoType';

export const metadata = { title: 'Page not found' };

const NotFound = () => {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-slate-800">
            {/* Floating circles */}
            <div className="absolute left-10 top-10 size-72 animate-float rounded-full bg-blue-100 opacity-40 blur-3xl" />
            <div className="absolute bottom-10 right-10 size-96 animate-float-delayed rounded-full bg-indigo-100 opacity-40 blur-3xl" />

            {/* Card */}
            <div className="relative z-10 max-w-lg rounded-3xl border border-white/40 bg-white/70 p-10 text-center shadow-xl backdrop-blur-lg">
                <div className="mb-6 flex animate-float justify-center">
                    <LogoType height={64} />
                </div>

                <h1 className="text-8xl font-extrabold tracking-tight text-slate-900">
                    404
                </h1>
                <h2 className="mt-2 text-2xl font-semibold text-slate-700">
                    Oops! Page Not Found
                </h2>

                <p className="mt-4 leading-relaxed text-slate-500">
                    We can&apos;t seem to find the page you&apos;re looking for.
                    <br />
                    It might have been moved, deleted, or never existed.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button asChild size="lg">
                        <Link href="/">
                            <Home className="size-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                        <a href="mailto:support@doorly.com">
                            <Mail className="size-4" />
                            Contact Support
                        </a>
                    </Button>
                </div>
            </div>

            <footer className="relative z-10 mt-12 text-center text-sm text-slate-500">
                &copy; YourApp. All rights reserved.
            </footer>
        </main>
    );
};

export default NotFound;
