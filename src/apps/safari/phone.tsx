import { NavScreen } from '@/phone/kit';
import { usePhoneApp } from '@/phone/nav';
import type { PhoneAppProps } from '../registry';
import { AddressBar } from './phone-address';
import { BlockedPage } from './phone-blocked';
import { WebFrame } from './phone-frame';
import { Favorites } from './phone-start';
import { hostOf, siteFor, type Site } from './sites';

interface Page {
  url: string;
}

/**
 * Safari, iOS 26: Favorites on the start page, the address bar at the
 * bottom. Sites that allow it load live in a frame; the rest show what they
 * look like and open in a new tab. Every page is a history entry, so the
 * browser's back gesture walks back through them.
 */
export default function View({ props }: PhoneAppProps<'safari'>) {
  const { screens, push, back, close } = usePhoneApp<Page>();
  const url = screens.at(-1)?.url ?? props.url;
  // The first page's button goes Home: history.back() there would only step a framed site back.
  const leave = screens.length ? { onBack: back, backLabel: '뒤로' } : { onBack: close, backLabel: '홈 화면으로' };

  if (!url) {
    return (
      <NavScreen key="start" title="즐겨찾기" leading={null} bottom={<AddressBar site={null} {...leave} />}>
        <Favorites onOpen={(href) => push({ url: href }, '/')} />
      </NavScreen>
    );
  }

  // The address asked for, under its favourite's name and icon; an unknown site goes by its host and opens in a new tab.
  const site: Site = { ...(siteFor(url) ?? { title: hostOf(url) ?? url, icon: 'icons/web', frameable: false }), href: url };
  return (
    // Keyed by address: every page starts with its own scroll position and title state.
    <NavScreen
      key={url}
      title={site.title}
      large={false}
      fill={site.frameable}
      background="plain"
      leading={null}
      bottom={<AddressBar site={site} {...leave} />}
    >
      {site.frameable ? <WebFrame key={url} src={url} title={`${site.title} 웹사이트`} /> : <BlockedPage site={site} />}
    </NavScreen>
  );
}
