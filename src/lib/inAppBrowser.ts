/**
 * Recruiters often open links inside KakaoTalk or LINE. Their in-app browsers
 * handle full screen and gestures poorly, and both apps document a way to hand
 * the page to the system browser, so use it. Other in-app browsers stay put:
 * there is no reliable hand-off for them and the site works there anyway.
 */
export function leaveInAppBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  const url = new URL(window.location.href);
  if (url.searchParams.has('openExternalBrowser')) return;

  if (ua.includes('kakaotalk')) {
    window.location.replace(`kakaotalk://web/openExternal?url=${encodeURIComponent(url.href)}`);
  } else if (/\bline\//.test(ua)) {
    url.searchParams.set('openExternalBrowser', '1');
    window.location.replace(url.href);
  }
}
