// GridProvider.ts
// GridX Layout Context Provider

export interface GridProviderOptions {
  columns?: number;
  gap?: string;
  rows?: string;
  responsive?: boolean;
}

export interface GridBreakpoint {
  maxWidth: number;
  columns: number;
}

export class GridProvider {
  private columns: number;
  private gap: string;
  private rows: string;
  private responsive: boolean;
  private breakpoints: GridBreakpoint[];

  constructor(options: GridProviderOptions = {}) {
    this.columns = options.columns || 12;
    this.gap = options.gap || '16px';
    this.rows = options.rows || 'auto';
    this.responsive = options.responsive ?? true;
    this.breakpoints = [];
  }

  public attach(container: HTMLElement): void {
    if (!container) {
      throw new Error('GridProvider: container is required');
    }

    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    container.style.gap = this.gap;
    container.style.gridAutoRows = this.rows;
    container.style.width = '100%';

    if (this.responsive) {
      this.applyResponsive(container);
    }
  }

  public setColumns(columns: number): void {
    this.columns = columns;
  }

  public setGap(gap: string): void {
    this.gap = gap;
  }

  public setRows(rows: string): void {
    this.rows = rows;
  }

  public addBreakpoint(maxWidth: number, columns: number): void {
    this.breakpoints.push({
      maxWidth,
      columns
    });

    this.breakpoints.sort((a, b) => a.maxWidth - b.maxWidth);
  }

  private applyResponsive(container: HTMLElement): void {
    const updateGrid = () => {
      const width = window.innerWidth;

      let activeColumns = this.columns;

      for (const breakpoint of this.breakpoints) {
        if (width <= breakpoint.maxWidth) {
          activeColumns = breakpoint.columns;
          break;
        }
      }

      container.style.gridTemplateColumns = `repeat(${activeColumns}, 1fr)`;
    };

    updateGrid();

    window.addEventListener('resize', updateGrid);
  }

  public createItem(
    element: HTMLElement,
    options: {
      colSpan?: number;
      rowSpan?: number;
      colStart?: number;
      rowStart?: number;
    } = {}
  ): HTMLElement {
    const {
      colSpan = 1,
      rowSpan = 1,
      colStart,
      rowStart
    } = options;

    element.style.gridColumn = colStart
      ? `${colStart} / span ${colSpan}`
      : `span ${colSpan}`;

    element.style.gridRow = rowStart
      ? `${rowStart} / span ${rowSpan}`
      : `span ${rowSpan}`;

    return element;
  }
}

// Helper factory
export function createGridProvider(
  options?: GridProviderOptions
): GridProvider {
  return new GridProvider(options);
}

export default GridProvider;

