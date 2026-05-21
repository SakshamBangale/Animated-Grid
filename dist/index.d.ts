// Grid.types.ts

export type GridBreakpoint =
  | "mobile"
  | "tablet"
  | "desktop"
  | "wide";

export type GridAlign =
  | "start"
  | "center"
  | "end"
  | "stretch";

export type GridJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface GridSizeMap<T> {
  mobile: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

export interface GridPosition {
  row: number;
  column: number;
}

export interface GridDimensions {
  width: number;
  height: number;
}

export interface GridItemLayout {
  id: string;
  position: GridPosition;
  size: GridDimensions;
}

export interface GridContainerProps {
  columns?: number;
  rows?: number;
  gap?: number | string;
  align?: GridAlign;
  justify?: GridJustify;
}

export interface GridState {
  items: GridItemLayout[];
  activeId?: string;
  isDragging?: boolean;
}

export interface GridAction {
  type:
    | "ADD_ITEM"
    | "REMOVE_ITEM"
    | "UPDATE_ITEM"
    | "RESET_GRID";
  payload?: unknown;
}

export type GridReducer = (
  state: GridState,
  action: GridAction
) => GridState;

export interface UseGridReturn {
  columns: number;
  rows: number;
  gap: number | string;
  items: GridItemLayout[];

  addItem: (item: GridItemLayout) => void;
  removeItem: (id: string) => void;
  updateItem: (
    id: string,
    updates: Partial<GridItemLayout>
  ) => void;

  clearGrid: () => void;
}
