import { BrowserRouter } from 'react-router-dom';
import { useExternalBrowserRedirect } from './hooks/useExternalBrowserRedirect';
import AppRoutes from './routes/AppRoutes.tsx';
import FullscreenGate from '@/components/FullscreenGate/FullscreenGate.tsx';

function AppShell() {
  useExternalBrowserRedirect();

  return (
    <>
      <FullscreenGate />
      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
