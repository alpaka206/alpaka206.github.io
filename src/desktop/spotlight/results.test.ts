import { describe, expect, it } from 'vitest';
import { INDEX, KIND_LABEL } from '@/os/search';
import { groupedResults, TOP_HIT } from './results';

describe('Spotlight results', () => {
  it('shows nothing until there is a query or a filter', () => {
    expect(groupedResults('', null)).toEqual([]);
    expect(groupedResults('   ', null)).toEqual([]);
  });

  it('puts the best match alone on top, then the rest by kind without repeats', () => {
    const groups = groupedResults('메아리', null);
    expect(groups[0]?.label).toBe(TOP_HIT);
    expect(groups[0]?.items).toHaveLength(1);
    const ids = groups.flatMap((group) => group.items.map((item) => item.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const group of groups.slice(1)) expect(new Set(group.items.map((item) => KIND_LABEL[item.kind]))).toEqual(new Set([group.label]));
  });

  it('lists a whole kind when only its filter is on', () => {
    const groups = groupedResults('', 'action');
    expect(groups).toHaveLength(1);
    expect(groups[0]?.label).toBe(KIND_LABEL.action);
    expect(groups[0]?.items).toHaveLength(INDEX.filter((item) => item.kind === 'action').length);
  });
});
