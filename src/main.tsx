import './polyfills';
import './styles/tokens.css';
import './styles/base.css';
import './reader/reader.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { leaveInAppBrowser } from './lib/inAppBrowser';

leaveInAppBrowser();

// Apple devices render the real system fonts (SF Pro, Apple SD Gothic Neo) through
// -apple-system; everyone else gets Pretendard, split by unicode range.
if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) {
  void import('pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css');
}

// The prerendered text version stays in the page for crawlers and no-JS readers;
// once the app runs it is hidden (and reachable again from the skip link).
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
