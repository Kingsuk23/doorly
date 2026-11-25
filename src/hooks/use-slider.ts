import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

export const useSlider = (activeIndex: number) => {
    const tabRef = useRef<HTMLDivElement | null>(null);
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
        updateIndicator();
    }, [updateIndicator]);

    useEffect(() => {
        const observer = new ResizeObserver(updateIndicator);
        if (tabRef.current) observer.observe(tabRef.current);

        window.addEventListener('resize', updateIndicator);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateIndicator);
        };
    }, [updateIndicator]);

    return { tabRef, buttonRefs, indicator };
};
