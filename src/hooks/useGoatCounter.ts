import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GOATCOUNTER_CODE = import.meta.env.VITE_GOATCOUNTER_CODE?.trim();
const SCRIPT_ID = 'goatcounter-script';

let loaderPromise: Promise<void> | null = null;

export function getGoatCounterEndpoint() {
  if (!GOATCOUNTER_CODE) return null;
  return `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
}

export function getGoatCounterCounterUrl(path = 'TOTAL') {
  if (!GOATCOUNTER_CODE) return null;
  return `https://${GOATCOUNTER_CODE}.goatcounter.com/counter/${path}.json`;
}

function loadGoatCounterScript() {
  const endpoint = getGoatCounterEndpoint();
  if (!endpoint || typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (document.getElementById(SCRIPT_ID)) {
    return Promise.resolve();
  }

  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<void>((resolve, reject) => {
    window.goatcounter = {
      ...(window.goatcounter ?? {}),
      endpoint,
      no_onload: true,
    };

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = 'https://gc.zgo.at/count.js';
    script.dataset.goatcounter = endpoint;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load GoatCounter script.'));
    document.body.appendChild(script);
  });

  return loaderPromise;
}

export function useGoatCounter() {
  const location = useLocation();

  useEffect(() => {
    if (!GOATCOUNTER_CODE) return;

    loadGoatCounterScript()
      .then(() => {
        window.goatcounter?.count?.({
          path: location.pathname,
        });
      })
      .catch(() => {});
  }, [location.pathname]);
}
