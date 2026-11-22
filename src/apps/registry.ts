import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { AppId, AppProps } from '@/os/apps';

/**
 * Each app lives in src/apps/<id>/ with two default-exported views:
 * desktop.tsx renders inside a window frame, phone.tsx fills the phone screen.
 * Both are lazy: opening an app is what downloads its code.
 */
export interface DesktopAppProps<A extends AppId = AppId> {
  windowId: string;
  props: Partial<AppProps[A]>;
}

export interface PhoneAppProps<A extends AppId = AppId> {
  props: Partial<AppProps[A]>;
}

export const DESKTOP_VIEWS: { [A in AppId]: LazyExoticComponent<ComponentType<DesktopAppProps<A>>> } = {
  finder: lazy(() => import('./finder/desktop')),
  portfolio: lazy(() => import('./portfolio/desktop')),
  about: lazy(() => import('./about/desktop')),
  messages: lazy(() => import('./messages/desktop')),
  mail: lazy(() => import('./mail/desktop')),
  photos: lazy(() => import('./photos/desktop')),
  notes: lazy(() => import('./notes/desktop')),
  safari: lazy(() => import('./safari/desktop')),
  github: lazy(() => import('./github/desktop')),
  blog: lazy(() => import('./blog/desktop')),
  terminal: lazy(() => import('./terminal/desktop')),
  preview: lazy(() => import('./preview/desktop')),
  settings: lazy(() => import('./settings/desktop')),
};

export const PHONE_VIEWS: { [A in AppId]: LazyExoticComponent<ComponentType<PhoneAppProps<A>>> } = {
  finder: lazy(() => import('./finder/phone')),
  portfolio: lazy(() => import('./portfolio/phone')),
  about: lazy(() => import('./about/phone')),
  messages: lazy(() => import('./messages/phone')),
  mail: lazy(() => import('./mail/phone')),
  photos: lazy(() => import('./photos/phone')),
  notes: lazy(() => import('./notes/phone')),
  safari: lazy(() => import('./safari/phone')),
  github: lazy(() => import('./github/phone')),
  blog: lazy(() => import('./blog/phone')),
  terminal: lazy(() => import('./terminal/phone')),
  preview: lazy(() => import('./preview/phone')),
  settings: lazy(() => import('./settings/phone')),
};
