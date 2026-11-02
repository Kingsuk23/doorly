'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useNav } from '@/hooks/useNav';
import PropertyPopupCard from '../home/hero/PropertyPopupCard';

// add real data
const FeaturedProperties = () => {
    const { handleNav, navRef, canScrollLeft, canScrollRight } = useNav();
    return (
        <section className="px-4 md:px-9 mt-12">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-semibold max-w-sm">
                    Homes We Think You’ll Love
                </h1>

                <div className="md:flex gap-4 item-center hidden">
                    <Button variant="outline" className="rounded-full" asChild>
                        <Link href="/featured">
                            View all properties <ChevronRight />
                        </Link>
                    </Button>

                    <div className="flex gap-2 items-center">
                        <Button
                            variant="outline"
                            size="icon-lg"
                            className="rounded-full"
                            onClick={() => handleNav('left')}
                            disabled={!canScrollLeft}
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-lg"
                            className="rounded-full"
                            onClick={() => handleNav('right')}
                            disabled={!canScrollRight}
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            </div>
            <div
                className="flex gap-3 items-center overflow-x-auto scroll-smooth scrollbar-none mt-6"
                ref={navRef}
            >
                {Array.from({ length: 15 }).map((_, index) => (
                    <PropertyPopupCard
                        key={index}
                        pin={{
                            id: '15',
                            slug: 'indore-garden-duplex',
                            title: 'Garden Duplex',
                            city: 'Indore, Madhya Pradesh',
                            price: 8900000,
                            beds: 4,
                            baths: 3,
                            sqft: 2100,
                            image: 'https://images.unsplash.com/photo-1574259392081-dbe3c19cd15e?q=80&w=552&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                            lat: 22.7196,
                            lng: 75.8577,
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProperties;
