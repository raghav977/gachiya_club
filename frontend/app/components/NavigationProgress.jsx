"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // React Query hooks to detect data fetching/mutations globally
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const [isNavigating, setIsNavigating] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef(null);
  const dataIntervalRef = useRef(null);

  // Clear any running interval
  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const clearDataInterval = () => {
    if (dataIntervalRef.current) {
      clearInterval(dataIntervalRef.current);
      dataIntervalRef.current = null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Navigation completion: when pathname/searchParams change
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsNavigating(false);
    clearProgressInterval();

    // Only set to 100 if we were navigating
    if (progress > 0 && progress < 100) {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(timeout);
    }
  }, [pathname, searchParams]);

  // ─────────────────────────────────────────────────────────────
  // Navigation start: detect link clicks
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      // Only trigger for internal links, not external or anchor
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        target.target !== "_blank"
      ) {
        setIsNavigating(true);
        setProgress(10);

        clearProgressInterval();
        // Simulate progress ticking up
        intervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearProgressInterval();
              return prev;
            }
            return prev + Math.random() * 15;
          });
        }, 200);
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      clearProgressInterval();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Data fetching: hook into React Query's isFetching/isMutating
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const isActive = isFetching > 0 || isMutating > 0;

    if (isActive && !isNavigating) {
      // Start data loading progress (don't override navigation progress)
      setIsDataLoading(true);

      if (progress === 0) {
        setProgress(15);
      }

      clearDataInterval();
      dataIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearDataInterval();
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 250);
    } else if (!isActive && isDataLoading) {
      // Data loading completed
      setIsDataLoading(false);
      clearDataInterval();

      if (!isNavigating) {
        setProgress(100);
        const timeout = setTimeout(() => setProgress(0), 300);
        return () => clearTimeout(timeout);
      }
    }
  }, [isFetching, isMutating, isNavigating, isDataLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearProgressInterval();
      clearDataInterval();
    };
  }, []);

  const isActive = isNavigating || isDataLoading;

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className={`h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg shadow-yellow-400/50 transition-all duration-300 ease-out ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}

// Wrap in Suspense to handle useSearchParams during SSR/static generation
export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
