import { useEffect } from 'react';

const OpenExternalBrowser = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const href = window.location.href;
    const url = new URL(href);

    if (url.searchParams.get('openExternalBrowser') === '1') {
      return;
    }

    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    const isKakao = userAgent.includes('kakaotalk');
    const isLine = userAgent.includes('line');

    const isInstagram = userAgent.includes('instagram');
    const isFacebook =
      userAgent.includes('fb_iab') ||
      userAgent.includes('fban') ||
      userAgent.includes('fbios') ||
      userAgent.includes('fbss') ||
      userAgent.includes('fb4a');

    const isTwitter = userAgent.includes('twitter');
    const isNaverApp = userAgent.includes('naver');
    const isKakaoStory = userAgent.includes('kakaostory');
    const isBand = userAgent.includes('band');
    const isEverytime = userAgent.includes('everytimeapp');
    const isSnapchat = userAgent.includes('snapchat');

    const isRegularBrowser =
      userAgent.includes('samsungbrowser') ||
      (userAgent.includes('wv') === false &&
        (userAgent.includes('chrome') ||
          userAgent.includes('firefox') ||
          userAgent.includes('fxios') ||
          userAgent.includes('safari') ||
          userAgent.includes('crios') ||
          userAgent.includes('edgios') ||
          userAgent.includes('edga') ||
          userAgent.includes('whale')));

    const isGenericInApp =
      (isInstagram ||
        isFacebook ||
        isTwitter ||
        isKakaoStory ||
        isBand ||
        isEverytime ||
        isSnapchat ||
        isNaverApp) &&
      !isRegularBrowser;

    const copyToClipboard = async (text: string) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch {}
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy'); // deprecated fallback
        document.body.removeChild(textarea);
        return true;
      } catch {
        return false;
      }
    };
    const redirect = async () => {
      // 1) KakaoTalk 인앱
      if (isKakao) {
        const target =
          'kakaotalk://web/openExternal?url=' + encodeURIComponent(href);
        window.location.replace(target);
        return;
      }

      // 2) LINE 인앱
      if (isLine) {
        const lineUrl = new URL(href);
        lineUrl.searchParams.set('openExternalBrowser', '1');
        window.location.replace(lineUrl.toString());
        return;
      }

      // 3) 기타 인앱 (Instagram/FB/Twitter/네이버앱 등)
      if (isGenericInApp) {
        if (isIOS) {
          // iOS는 완전 자동 열기가 제한될 수 있음 → 클립보드 + 안내 후 Safari 호출 시도
          await copyToClipboard(href);
          alert(
            'URL이 클립보드에 복사되었어요.\n\n아래에서 Safari가 열리면 주소창을 길게 눌러 "붙여넣기 및 이동"을 선택해 주세요.'
          );
          // iOS에서 외부 브라우저 열기 트릭은 OS/앱 버전에 따라 제한됨
          // 가능 시도 (실패해도 무해)
          window.location.replace('x-web-search://?');
          return;
        } else if (isAndroid) {
          // Chrome intent with fallback
          const hostAndPath = href.replace(/^https?:\/\//i, '');
          const fallback = encodeURIComponent(href);
          const intent =
            `intent://${hostAndPath}` +
            `#Intent;scheme=${href.startsWith('https') ? 'https' : 'http'}` +
            `;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
          window.location.replace(intent);
          return;
        }
      }

      // 그 외: 아무 것도 하지 않음 (정상 브라우저)
    };

    if (document.readyState !== 'loading') redirect();
    else document.addEventListener('DOMContentLoaded', redirect);
  }, []);

  return null;
};

export default OpenExternalBrowser;
