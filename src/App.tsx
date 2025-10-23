import { BrowserRouter } from 'react-router-dom';
import { useExternalBrowserRedirect } from './hooks/useExternalBrowserRedirect';
import AppRoutes from './routes/AppRoutes.tsx';
import FullscreenGate from '@/components/FullscreenGate/FullscreenGate.tsx';

export default function App() {
  useExternalBrowserRedirect();

  return (
    <BrowserRouter>
      <FullscreenGate />
      <AppRoutes />
    </BrowserRouter>
  );
}
