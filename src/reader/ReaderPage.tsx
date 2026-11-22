import { useEffect } from 'react';
import { Reader } from './Reader';

/** /text in the browser: the same document the build prerenders, with the OS out of the way. */
export default function ReaderPage() {
  useEffect(() => {
    document.title = '김규원 | 텍스트 버전';
  }, []);
  return (
    <main className="reader-page">
      <Reader />
    </main>
  );
}
