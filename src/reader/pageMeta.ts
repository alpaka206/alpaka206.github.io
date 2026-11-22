/** One prerendered page: shared by the SSR entry and scripts/prerender.ts. */
export interface PageMeta {
  path: string;
  title: string;
  description: string;
  html: string;
  /**
   * Where search engines should look instead. App windows (메시지, 터미널…) carry the same
   * text as the home page, so they point there and stay out of the sitemap.
   */
  canonical?: string;
}
