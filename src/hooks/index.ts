// hook.ts

import { useCallback, useMemo, useState } from "react";

export type GridItem = {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
};

type UseGridOptions = {
  rows?: number;
  cols?: number;
  gap?: number;
};

export function useGrid(options: UseGridOptions = {}) {
  const {
    rows = 12,
    cols = 12,
    gap = 8,
  } = options;

  const [items, setItems] = useState<GridItem[]>([]);

  const addItem = useCallback((item: GridItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback(
    (id: string, updates: Partial<GridItem>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...updates }
            : item
        )
      );
    },
    []
  );

  const clearGrid = useCallback(() => {
    setItems([]);
  }, []);

  const gridStyles = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: `${gap}px`,
      width: "100%",
      height: "100%",
    }),
    [cols, rows, gap]
  );

  return {
    rows,
    cols,
    gap,
    items,
    gridStyles,
    addItem,
    removeItem,
    updateItem,
    clearGrid,
  };
}

export default useGrid;
