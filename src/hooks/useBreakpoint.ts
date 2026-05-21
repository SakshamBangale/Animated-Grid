// useBreakpoint.ts

import { useEffect, useState } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.wide) return "wide";
  if (width >= BREAKPOINTS.desktop) return "desktop";
  if (width >= BREAKPOINTS.tablet) return "tablet";
  return "mobile";
}

export function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(
    getBreakpoint(width)
  );

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      setWidth(currentWidth);
      setBreakpoint(getBreakpoint(currentWidth));
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    width,
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
    isWide: breakpoint === "wide",
  };
}

export default useBreakpoint;
