import { useState } from 'react';
import { GlassButton, Glyph, SearchField, Toolbar } from '@/phone/kit';
import { Glass } from '@/ui/Glass';
import { hostOf, toAddress, type Site } from './sites';
import styles from './safari.phone.module.css';

interface AddressBarProps {
  /** The page on screen; the start page shows a field instead. */
  site: Site | null;
  /** Back a page, or home from the first one. */
  onBack: () => void;
  backLabel: string;
}

/**
 * Safari's bottom bar (iOS 26): back, the address in a glass capsule (with a
 * padlock for https), and "open in a new tab". On the start page the capsule
 * is a field: an address opens in a new tab, anything else searches.
 */
export function AddressBar({ site, onBack, backLabel }: AddressBarProps) {
  const [text, setText] = useState('');
  const host = site && (hostOf(site.href) ?? site.href);
  return (
    <Toolbar label="Safari 도구 막대">
      <GlassButton icon="chevron.left" size={48} label={backLabel} onClick={onBack} />
      {site ? (
        <>
          <Glass variant="control" radius={24} className={styles.address} aria-label={`주소 ${host}`} role="note">
            {site.href.startsWith('https:') && <Glyph name="lock" pt={13} weight="semibold" className={styles.lock} />}
            <span className={styles.addressText}>{host}</span>
          </Glass>
          <GlassButton icon="arrow.up.right.square" size={48} label="새 탭에서 열기" href={site.href} target="_blank" rel="noreferrer" />
        </>
      ) : (
        <SearchField
          variant="glass"
          className={styles.field}
          value={text}
          onChange={setText}
          placeholder="검색 또는 웹사이트 이름"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          onSubmit={() => {
            const address = toAddress(text);
            if (!address) return;
            window.open(address, '_blank', 'noopener');
            setText('');
          }}
        />
      )}
    </Toolbar>
  );
}
