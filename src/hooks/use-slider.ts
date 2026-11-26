import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export const useSlider = (activeIndex: number) => {
    const [tabEl, setTabEl] = useState<HTMLDivElement | null>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicator, setIndicator] = useState({ width: 0, left: 0 });

    const updateIndicator = useCallback(() => {
        const activeButton = buttonRefs.current[activeIndex];
        if (!activeButton) return;

        setIndicator({
            width: activeButton.offsetWidth,
            left: activeButton.offsetLeft,
        });
    }, [activeIndex]);

    useLayoutEffect(() => {
        if (!tabEl) return;
        updateIndicator();

        const observer = new ResizeObserver(updateIndicator);
        observer.observe(tabEl);
        window.addEventListener('resize', updateIndicator);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateIndicator);
        };
    }, [tabEl, updateIndicator]);

    return { tabRef: setTabEl, buttonRefs, indicator };
};
