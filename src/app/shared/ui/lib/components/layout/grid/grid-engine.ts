// ── Grid Layout Engine ──────────────────────────────────────────────────────
// Pure TS, zero Angular deps. Gridstack-inspired layout math.

export interface GridEngineItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  label?: string;
  elementId?: string;
}

export interface GridEngineConfig {
  columns: number;
  maxRows: number;
  cellHeight: number;
  gap: number;
}

// ── Collision helpers ───────────────────────────────────────────────────────

/** Check if two items overlap */
function collides(a: GridEngineItem, b: GridEngineItem): boolean {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

/** Get all items that collide with the given item (excluding itself) */
function getCollisions(
  item: GridEngineItem,
  items: GridEngineItem[],
): GridEngineItem[] {
  return items.filter((other) => other.id !== item.id && collides(item, other));
}

// ── Core functions ──────────────────────────────────────────────────────────

/** Clamp item within grid boundaries */
function clampItem(item: GridEngineItem, columns: number): GridEngineItem {
  const w = Math.min(item.w, columns);
  const x = Math.max(0, Math.min(item.x, columns - w));
  const y = Math.max(0, item.y);
  return { ...item, x, y, w };
}

/**
 * Pack items vertically — move each item up as far as possible
 * without overlapping. Processes top-to-bottom, left-to-right.
 */
export function packItems(
  items: GridEngineItem[],
  columns: number,
): GridEngineItem[] {
  const sorted = [...items].sort((a, b) => a.y - b.y || a.x - b.x);
  const packed: GridEngineItem[] = [];

  for (const item of sorted) {
    let candidate = { ...item, y: 0 };
    // Move down until no collision
    while (getCollisions(candidate, packed).length > 0) {
      candidate = { ...candidate, y: candidate.y + 1 };
    }
    packed.push(clampItem(candidate, columns));
  }

  return packed;
}

/** Check if an item can be placed at (x, y) without any collision */
export function canPlaceItem(
  item: GridEngineItem,
  items: GridEngineItem[],
  columns: number,
): boolean {
  if (item.x < 0 || item.y < 0 || item.x + item.w > columns) return false;
  return getCollisions(item, items).length === 0;
}

/**
 * Move an item to (newX, newY). Colliding items are pushed down.
 * Returns updated full item list.
 */
export function moveItem(
  id: string,
  newX: number,
  newY: number,
  items: GridEngineItem[],
  columns: number,
): GridEngineItem[] {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return items;

  const moved = clampItem({ ...items[idx], x: newX, y: newY }, columns);
  let result = items.map((i) => (i.id === id ? moved : { ...i }));

  // Push down any colliding items
  result = resolveCollisions(moved, result, columns);

  // Pack all other items upward (compact) while keeping the moved item in place
  const others = result.filter((i) => i.id !== id);
  const packed = packItems(others, columns);
  // Re-resolve: packing may have moved items under the moved item
  result = [moved, ...packed.filter((i) => i.id !== id)];
  result = resolveCollisions(moved, result, columns);

  return result;
}

/**
 * Resize an item to (newW, newH). Colliding items are pushed down.
 * Returns updated full item list.
 */
export function resizeItem(
  id: string,
  newW: number,
  newH: number,
  items: GridEngineItem[],
  columns: number,
): GridEngineItem[] {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return items;

  const orig = items[idx];
  const w = Math.max(orig.minW ?? 1, Math.min(newW, columns - orig.x));
  const h = Math.max(orig.minH ?? 1, newH);
  const resized = { ...orig, w, h };

  let result = items.map((i) => (i.id === id ? resized : { ...i }));
  result = resolveCollisions(resized, result, columns);

  // Pack all other items upward (compact) while keeping the resized item in place
  const others = result.filter((i) => i.id !== id);
  const packed = packItems(others, columns);
  result = [resized, ...packed.filter((i) => i.id !== id)];
  result = resolveCollisions(resized, result, columns);

  return result;
}

/** Recursively push colliding items down */
function resolveCollisions(
  movedItem: GridEngineItem,
  items: GridEngineItem[],
  columns: number,
): GridEngineItem[] {
  const colliding = getCollisions(movedItem, items);
  let result = [...items];

  for (const col of colliding) {
    // Push the colliding item below the moved item
    const pushedY = movedItem.y + movedItem.h;
    const pushed = clampItem({ ...col, y: pushedY }, columns);
    result = result.map((i) => (i.id === col.id ? pushed : i));
    // Recursively fix any new collisions
    result = resolveCollisions(pushed, result, columns);
  }

  return result;
}

/**
 * Add a new item at the first available 1×1 position.
 * Returns [updatedItems, newItem].
 */
export function addItem(
  items: GridEngineItem[],
  columns: number,
  defaults?: Partial<GridEngineItem>,
): [GridEngineItem[], GridEngineItem] {
  const id = defaults?.id ?? `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const w = defaults?.w ?? 1;
  const h = defaults?.h ?? 1;

  // Scan grid top-to-bottom, left-to-right for first open slot
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x <= columns - w; x++) {
      const candidate: GridEngineItem = {
        id,
        x,
        y,
        w,
        h,
        label: defaults?.label,
        elementId: defaults?.elementId,
      };
      if (canPlaceItem(candidate, items, columns)) {
        return [[...items, candidate], candidate];
      }
    }
  }

  // Fallback: place at bottom
  const maxY = items.reduce((max, i) => Math.max(max, i.y + i.h), 0);
  const newItem: GridEngineItem = {
    id,
    x: 0,
    y: maxY,
    w,
    h,
    label: defaults?.label,
    elementId: defaults?.elementId,
  };
  return [[...items, newItem], newItem];
}

/** Remove an item by id */
export function removeItem(
  id: string,
  items: GridEngineItem[],
): GridEngineItem[] {
  return items.filter((i) => i.id !== id);
}

// ── Pixel ↔ Grid conversion ────────────────────────────────────────────────

export function pixelToGrid(
  px: number,
  py: number,
  cellWidth: number,
  cellHeight: number,
  gap: number,
): { gx: number; gy: number } {
  const gx = Math.round(px / (cellWidth + gap));
  const gy = Math.round(py / (cellHeight + gap));
  return { gx: Math.max(0, gx), gy: Math.max(0, gy) };
}

export function gridToPixel(
  gx: number,
  gy: number,
  cellWidth: number,
  cellHeight: number,
  gap: number,
): { px: number; py: number } {
  return {
    px: gx * (cellWidth + gap),
    py: gy * (cellHeight + gap),
  };
}

/** Calculate total grid height in rows based on item positions */
export function getGridHeight(items: GridEngineItem[]): number {
  if (items.length === 0) return 0;
  return items.reduce((max, i) => Math.max(max, i.y + i.h), 0);
}
