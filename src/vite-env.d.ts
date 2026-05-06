/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOATCOUNTER_CODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  goatcounter?: {
    endpoint?: string;
    no_onload?: boolean;
    visit_count?: (options: {
      append?: string;
      path?: string;
      no_branding?: boolean;
      attr?: Record<string, string>;
      style?: string;
      type?: 'html' | 'svg' | 'png';
    }) => void;
    count?: (options?: Record<string, unknown>) => void;
  };
}
