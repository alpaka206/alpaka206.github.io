/**
 * A mailto: URL per RFC 6068: every value percent-encoded (spaces as %20, not
 * "+", which mail apps would show literally) and line breaks sent as CRLF.
 */
export function mailtoHref(to: string, fields: { subject?: string; body?: string }): string {
  const query = Object.entries(fields)
    .flatMap(([key, value]) => (value ? [`${key}=${encodeURIComponent(value.replace(/\r?\n/g, '\r\n'))}`] : []))
    .join('&');
  return `mailto:${to}${query ? `?${query}` : ''}`;
}
