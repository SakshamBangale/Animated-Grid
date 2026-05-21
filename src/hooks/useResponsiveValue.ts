// useResponsiveValue.ts

import { useEffect, useMemo, useState } from "react";

type ResponsiveValues<T> = {
  mobile: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
};

type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

const BREAKPOINTS = {
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

export function useResponsiveValue<T>(
  values: ResponsiveValues<T>
): T {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined"
      ? window.innerWidth
      : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const breakpoint = useMemo(
    () => getBreakpoint(width),
    [width]
  );

  const responsiveValue = useMemo(() => {
    switch (breakpoint) {
      case "wide":
        return (
          values.wide ??
          values.desktop ??
          values.tablet ??
          values.mobile
        );

      case "desktop":
        return (
          values.desktop ??
          values.tablet ??
          values.mobile
        );

      case "tablet":
        return values.tablet ?? values.mobile;

      default:
        return values.mobile;
    }
  }, [breakpoint, values]);

  return responsiveValue;
}

export default useResponsiveValue;
