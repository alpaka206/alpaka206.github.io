import { useEffect, useRef } from 'react';
import { PROFILE } from '@/content/profile';
import { Picture } from '@/media/Picture';
import { GlassButton, NavScreen, Toolbar, ToolbarSpacer } from '@/phone/kit';
import { share, shareUrl } from '../finder/share';
import type { PhoneAppProps } from '../registry';
import { clampPage, PAGE_COUNT, pageKey, PAGES } from './pdf';
import styles from './preview.phone.module.css';

/** The portfolio PDF as a vertical stack of pages, with download and share at the bottom. */
export default function View({ props }: PhoneAppProps<'preview'>) {
  const list = useRef<HTMLOListElement>(null);
  const first = clampPage(props.page ?? 1);
  useEffect(() => {
    if (props.page) list.current?.querySelector(`[data-page="${props.page}"]`)?.scrollIntoView({ block: 'start' });
  }, [props.page]);

  return (
    <NavScreen
      title="포트폴리오 PDF"
      large={false}
      bottom={
        <Toolbar label="PDF">
          <GlassButton
            icon="square.and.arrow.up"
            size={48}
            label="공유"
            onClick={() => void share(`${PROFILE.name} 포트폴리오 PDF`, shareUrl(PROFILE.portfolioPdf), 'preview')}
          />
          <ToolbarSpacer />
          <GlassButton href={PROFILE.portfolioPdf} download label="PDF 내려받기" size={48} prominent>
            PDF 내려받기
          </GlassButton>
        </Toolbar>
      }
    >
      {/* The pages are pictures; the same content is readable as text. */}
      <p className={styles.textVersion}>
        <a href="/text">텍스트 버전으로 읽기</a>
      </p>
      <ol ref={list} className={styles.pages}>
        {PAGES.map((page) => (
          <li key={page} className={styles.page} data-page={page}>
            <Picture src={pageKey(page)} alt={`포트폴리오 ${page}쪽`} sizes="(max-width: 767px) 100vw, 400px" priority={page === first} className={styles.image} />
            <span className={styles.number} aria-hidden="true">
              {page} / {PAGE_COUNT}
            </span>
          </li>
        ))}
      </ol>
    </NavScreen>
  );
}
