import { useCallback, useEffect, useRef, useState } from 'react';

type Direction = 'left' | 'right';

export const useNav = (step = 200) => {
    const navRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateButtons = useCallback(() => {
        const el = navRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 0);

        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }, []);

    const handleNav = (direction: Direction) => {
        navRef.current?.scrollBy({
            left: direction === 'left' ? -step : step,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const el = navRef.current;
        if (!el) return;

        updateButtons();

        el.addEventListener('scroll', updateButtons);

        const observer = new ResizeObserver(updateButtons);
        observer.observe(el);

        return () => {
            el.removeEventListener('scroll', updateButtons);
            observer.disconnect();
        };
    }, [updateButtons]);

    return { navRef, handleNav, canScrollLeft, canScrollRight };
};
