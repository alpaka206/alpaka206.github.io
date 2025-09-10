import { BrowserRouter } from 'react-router-dom';
import { useExternalBrowserRedirect } from './hooks/useExternalBrowserRedirect';
import AppRoutes from './routes/AppRoutes.tsx';

export default function App() {
  useExternalBrowserRedirect();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
