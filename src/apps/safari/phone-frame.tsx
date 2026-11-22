import { useState } from 'react';
import styles from './safari.phone.module.css';

interface WebFrameProps {
  src: string;
  title: string;
}

/**
 * A web page inside the phone (Safari's page view, also used by the blog
 * app like an in-app browser). The frame stays invisible behind a spinner
 * until it has loaded, so there is no white flash. It cannot navigate the
 * portfolio itself away (no allow-top-navigation in the sandbox).
 */
export function WebFrame({ src, title }: WebFrameProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={styles.web}>
      <span className="visually-hidden" role="status">
        {loaded ? '' : '페이지를 불러오는 중…'}
      </span>
      {!loaded && <span className={styles.spinner} aria-hidden="true" />}
      <iframe
        src={src}
        title={title}
        className={styles.frame}
        data-loaded={loaded || undefined}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
