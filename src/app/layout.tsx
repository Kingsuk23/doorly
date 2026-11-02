import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../style/globals.css';
import Navbar from '@/components/layout/navbar/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: 'Doorly | Find Your Next Home',
        template: '%s | Doorly',
    },
    description:
        'Search homes for sale and rent, save your favorite listings, and book tours with local agents.',
    twitter: {
        card: 'summary_large_image',
        images: ['/meta/opengraph-image.png'],
    },
    icons: {
        icon: [
            {
                url: '/meta/favicon.ico',
                sizes: '48x48',
            },
            { url: '/meta/icon.png', type: 'image/png', sizes: '96x96' },
        ],
        apple: [{ url: '/meta/apple-icon.png', sizes: '180x180' }],
    },
    openGraph: {
        type: 'website',
        siteName: 'Doorly',
        title: 'Doorly | Find Your Next Home',
        description:
            'Search homes for sale and rent, and book tours with local agents.',
        images: [
            {
                url: '/meta/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'YourApp - Find your next home',
            },
        ],
    },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={`${geistSans.variable} antialiased`}>
            <body className="min-h-screen overflow-x-hidden bg-white text-neutral-950 text-base font-sans">
                <Toaster />
                <Navbar />
                <NuqsAdapter>{children}</NuqsAdapter>
            </body>
        </html>
    );
}
