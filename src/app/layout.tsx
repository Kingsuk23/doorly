import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

import '../styles/globals.css';
import { Toaster } from '@/components/ui/toast';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
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
            <body className="min-h-screen overflow-x-hidden text-base">
                {children} <Toaster />
            </body>
        </html>
    );
}
