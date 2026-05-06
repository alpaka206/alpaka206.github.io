import { useEffect, useState } from 'react';
import { getGoatCounterCounterUrl } from './useGoatCounter';

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const url = getGoatCounterCounterUrl();
    if (!url) return;

    let ignore = false;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch visitor count.');
        }
        return response.json();
      })
      .then((payload) => {
        if (ignore) return;
        const numeric =
          typeof payload?.count === 'number'
            ? payload.count
            : typeof payload?.total === 'number'
              ? payload.total
              : null;
        setCount(numeric);
      })
      .catch(() => {
        if (!ignore) {
          setCount(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return count;
}
