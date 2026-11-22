import { APPS, DOCK_APPS, type AppId } from '@/os/apps';

export type StackId = 'awards' | 'documents';

/** One thing in the Dock, left to right. */
export type DockItem =
  | { kind: 'app'; key: string; app: AppId; running: boolean }
  | { kind: 'divider'; key: string }
  | { kind: 'stack'; key: string; stack: StackId }
  | { kind: 'trash'; key: string };

const APP_ORDER = Object.keys(APPS) as AppId[];

/**
 * macOS 27 order: pinned apps (with their own divider), apps that run without
 * being pinned (a document window such as a project case study), then a
 * divider before the stacks and the Trash.
 */
export function dockItems(running: ReadonlySet<AppId>): DockItem[] {
  const items: DockItem[] = DOCK_APPS.map((app, i) =>
    app ? { kind: 'app', key: app, app, running: running.has(app) } : { kind: 'divider', key: `divider-${i}` },
  );
  const recent = APP_ORDER.filter((app) => running.has(app) && !DOCK_APPS.includes(app));
  if (recent.length) {
    items.push({ kind: 'divider', key: 'divider-recent' });
    for (const app of recent) items.push({ kind: 'app', key: app, app, running: true });
  }
  items.push(
    { kind: 'divider', key: 'divider-stacks' },
    { kind: 'stack', key: 'stack-awards', stack: 'awards' },
    { kind: 'stack', key: 'stack-documents', stack: 'documents' },
    { kind: 'trash', key: 'trash' },
  );
  return items;
}
