/** One prerendered page: shared by the SSR entry and scripts/prerender.ts. */
export interface PageMeta {
  path: string;
  title: string;
  description: string;
  html: string;
}
