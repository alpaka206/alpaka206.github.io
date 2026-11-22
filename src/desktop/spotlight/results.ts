import { INDEX, KIND_LABEL, search, type SearchItem, type SearchKind } from '@/os/search';

/** "Top Hit", as SpotlightServices.loctable ships it in Korean (DOMAIN_TOPHIT). */
export const TOP_HIT = '가장 연관성 높은 항목';

export interface ResultGroup {
  label: string;
  items: SearchItem[];
}

/**
 * Spotlight's layout: the best match alone at the top, then everything else
 * grouped by kind in rank order. With a kind filter on, an empty query lists
 * that whole kind.
 */
export function groupedResults(query: string, filter: SearchKind | null): ResultGroup[] {
  const ranked = filter
    ? (query.trim() ? search(query, 60) : [...INDEX]).filter((item) => item.kind === filter)
    : search(query);
  const [top, ...rest] = query.trim() ? ranked : [];
  const groups: ResultGroup[] = top ? [{ label: TOP_HIT, items: [top] }] : [];
  const byKind = new Map<SearchKind, SearchItem[]>();
  for (const item of top ? rest : ranked) byKind.set(item.kind, [...(byKind.get(item.kind) ?? []), item]);
  for (const [kind, items] of byKind) groups.push({ label: KIND_LABEL[kind], items });
  return groups;
}
