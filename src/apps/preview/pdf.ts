/**
 * The portfolio PDF as Preview shows it: 20 pages rendered to images
 * (pdf/portfolio-01 … 20, 1440 × 810 pt pages, as in the PDF's media box).
 */
export const PAGE_COUNT = 20;
export const PAGE_WIDTH = 1440;
export const FILE_NAME = '김규원_포트폴리오.pdf';

/** Page numbers, 1 to 20. */
export const PAGES = Array.from({ length: PAGE_COUNT }, (_, i) => i + 1);

export const pageKey = (page: number) => `pdf/portfolio-${String(page).padStart(2, '0')}`;

export const clampPage = (page: number) => Math.min(Math.max(Math.round(page) || 1, 1), PAGE_COUNT);

/**
 * Zoom as PDFView does it on macOS 27.2.1: each step multiplies the scale by
 * 2^(1/4) (zoomIn from 1 gives 1.1892, 1.4142, 1.6818, 2). The range is kept
 * to 0.25…4 of actual size: the pages are 2400 px images, not vectors.
 */
const ZOOM_STEP = 2 ** 0.25;
export const MIN_SCALE = 0.25;
export const MAX_SCALE = 4;

export function zoomed(scale: number, steps: number): number {
  return Math.min(Math.max(scale * ZOOM_STEP ** steps, MIN_SCALE), MAX_SCALE);
}

/** Preview's subtitle (Localizable.loctable "Page %ld of %ld" → "%ld/%ld페이지"). */
export const pageLabel = (page: number) => `${page}/${PAGE_COUNT}페이지`;
