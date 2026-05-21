// useGridColumns.ts

import { useEffect, useMemo, useState } from "react";

type GridColumnOptions = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  wide?: number;
};

const DEFAULT_COLUMNS: Required<GridColumnOptions> = {
  mobile: 1,
  tablet: 2,
  desktop: 4,
  wide: 6,
};

function getColumnCount(
  width: number,
  options: Required<GridColumnOptions>
) {
  if (width >= 1440) return options.wide;
  if (width >= 1024) return options.desktop;
  if (width >= 768) return options.tablet;

  return options.mobile;
}

export function useGridColumns(
  config: GridColumnOptions = DEFAULT_COLUMNS
) {
  const settings = {
    ...DEFAULT_COLUMNS,
    ...config,
  };

  const [width, setWidth] = useState(
    typeof window !== "undefined"
      ? window.innerWidth
      : 0
  );

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const columns = useMemo(() => {
    return getColumnCount(width, settings);
  }, [width, settings]);

  const gridTemplateColumns = useMemo(() => {
    return `repeat(${columns}, minmax(0, 1fr))`;
  }, [columns]);

  return {
    width,
    columns,
    gridTemplateColumns,
    style: {
      display: "grid",
      gridTemplateColumns,
      width: "100%",
    },
  };
}

export default useGridColumns;
