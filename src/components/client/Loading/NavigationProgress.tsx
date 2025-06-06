'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const NavigationProgress = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        // Function to handle route change start
        const handleRouteChangeStart = () => {
            setIsLoading(true);
            setProgress(0);

            // Fast progress to 30% rapidly
            timeoutId = setTimeout(() => {
                setProgress(30);

                // Then progress more slowly to 80%
                timeoutId = setTimeout(() => {
                    setProgress(80);
                }, 500);
            }, 100);
        };

        // Function to handle route change complete
        const handleRouteChangeComplete = () => {
            setProgress(100);

            // Reset after animation completes
            timeoutId = setTimeout(() => {
                setIsLoading(false);
                setProgress(0);
            }, 300);
        };

        // Create a MutationObserver to watch for navigation events
        const observer = new MutationObserver(() => {
            handleRouteChangeStart();
            timeoutId = setTimeout(() => {
                handleRouteChangeComplete();
            }, 1000);
        });

        // Observe root element for navigation changes
        if (typeof document !== 'undefined') {
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            });
        }

        // Trigger on pathname or search params change
        handleRouteChangeStart();
        handleRouteChangeComplete();

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [pathname, searchParams]);

    if (!isLoading && progress === 0) {
        return null;
    }

    return (
        <div
            className="fixed top-0 left-0 z-[9999] h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            style={{
                width: `${progress}%`,
                transition: 'width 300ms ease-in-out',
            }}
        />
    );
};

export default NavigationProgress;
