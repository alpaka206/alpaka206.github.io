const isLocalHost = (h: string) =>
  h === 'localhost' || h === '127.0.0.1' || h === '[::1]';

export function resolveUrl(path: string) {
  const Prod = 'https://alpaka206.github.io';
  const Dev = 'http://localhost:5173';

  const hostname =
    typeof window !== 'undefined' ? window.location.hostname : '';

  // 로컬 기준: 개발 모드이거나 localhost 류 호스트
  const isLocal =
    (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
    isLocalHost(hostname);

  const base = isLocal && Dev ? Dev : Prod;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalizedPath}`;
}
