// GridX - Lightweight Grid Layout Library
// index.js

class GridX {
  constructor(options = {}) {
    this.columns = options.columns || 12;
    this.gap = options.gap || '16px';
    this.rows = options.rows || 'auto';
    this.containerClass = options.containerClass || 'gridx-container';
    this.itemClass = options.itemClass || 'gridx-item';
  }

  createContainer(element) {
    if (!element) {
      throw new Error('GridX: Container element is required.');
    }

    element.classList.add(this.containerClass);
    element.style.display = 'grid';
    element.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    element.style.gap = this.gap;
    element.style.gridAutoRows = this.rows;

    return element;
  }

  createItem(element, options = {}) {
    if (!element) {
      throw new Error('GridX: Grid item element is required.');
    }

    const {
      colSpan = 1,
      rowSpan = 1,
      colStart,
      rowStart,
      align = 'stretch',
      justify = 'stretch'
    } = options;

    element.classList.add(this.itemClass);

    element.style.gridColumn = colStart
      ? `${colStart} / span ${colSpan}`
      : `span ${colSpan}`;

    element.style.gridRow = rowStart
      ? `${rowStart} / span ${rowSpan}`
      : `span ${rowSpan}`;

    element.style.alignSelf = align;
    element.style.justifySelf = justify;

    return element;
  }

  addResponsiveBreakpoint(element, breakpoint, columns) {
    const styleId = `gridx-style-${breakpoint}`;

    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML += `
      @media (max-width: ${breakpoint}px) {
        .${this.containerClass} {
          grid-template-columns: repeat(${columns}, 1fr);
        }
      }
    `;

    return element;
  }
}

// Utility helpers
const GridUtils = {
  center(element) {
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    return element;
  },

  card(element, radius = '20px', shadow = '0 10px 30px rgba(0,0,0,0.15)') {
    element.style.borderRadius = radius;
    element.style.boxShadow = shadow;
    element.style.padding = '16px';
    element.style.background = '#ffffff';
    return element;
  },

  glass(element) {
    element.style.backdropFilter = 'blur(14px)';
    element.style.background = 'rgba(255,255,255,0.12)';
    element.style.border = '1px solid rgba(255,255,255,0.2)';
    return element;
  }
};

// Factory function
function createGridX(options = {}) {
  return new GridX(options);
}

// Export module
export {
  GridX,
  GridUtils,
  createGridX
};

export default GridX;

/*
Example Usage:

import GridX, { GridUtils } from './index.js';

const grid = new GridX({
  columns: 4,
  gap: '20px'
});

const container = document.getElementById('app');
grid.createContainer(container);

const item = document.createElement('div');
item.innerHTML = 'Hello GridX';

grid.createItem(item, {
  colSpan: 2,
  rowSpan: 1
});

GridUtils.card(item);
container.appendChild(item);
*/
