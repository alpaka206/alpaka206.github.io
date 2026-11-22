import { useState } from 'react';
import { PROFILE } from '@/content/profile';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowTitle } from '@/desktop/kit/window';
import styles from './Blog.module.css';

/**
 * The blog as a Safari web app (Add to Dock): its own window, the page, reload
 * and a way out to a real tab. Where the frame has been is out of reach
 * (cross-origin), so there is no back or forward, and a reload starts at the
 * blog's home.
 */
export default function BlogWindow() {
  const [session, setSession] = useState(0);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    setSession((n) => n + 1);
  };

  useWindowTitle('블로그');
  useWindowCommands({ 'safari.reload': reload });

  return (
    <div className={styles.blog}>
      <Toolbar inset title="블로그" subtitle={PROFILE.blog.label}>
        <ToolbarGroup label="페이지">
          <ToolbarButton icon="arrow.clockwise" label="페이지 다시 로드" aria-keyshortcuts="Meta+R" onClick={reload} />
          <ToolbarLink icon="arrow.up.right.square" label="새 탭에서 열기" href={PROFILE.blog.href} />
        </ToolbarGroup>
      </Toolbar>
      <div className={styles.page} data-loading={loading || undefined}>
        <span className={styles.progress} aria-hidden="true" />
        <iframe
          key={session}
          className={styles.frame}
          src={PROFILE.blog.href}
          title={`${PROFILE.name}의 블로그`}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}
