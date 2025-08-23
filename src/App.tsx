import { BrowserRouter } from 'react-router-dom';
import OpenExternalBrowser from './OpenExternalBrowser.tsx';
import AppRoutes from './routes/AppRoutes.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <OpenExternalBrowser />
      <AppRoutes />
    </BrowserRouter>
  );
}
