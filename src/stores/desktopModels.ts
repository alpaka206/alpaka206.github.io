export type PageType =
  | 'about'
  | 'awards'
  | 'blog'
  | 'insta'
  | 'github'
  | 'comatching'
  | 'share-it'
  | 'alnc';

export type BrowserAppId =
  | 'browser-home'
  | 'blog'
  | 'insta'
  | 'github';

export type CodeWorkspaceId = 'portfolio-workspace';

export type FolderContentType =
  | 'projects'
  | 'user-folder'
  | 'recycle-bin';

export type WallpaperId =
  | 'windows-cloud'
  | 'aurora-flow'
  | 'sunset-panel';

export type NoteColorId = 'yellow' | 'blue' | 'pink';

export interface DesktopPosition {
  x: number;
  y: number;
}

export interface PageTab {
  id: PageType;
  title: string;
  icon: string;
}

type DesktopShortcutBase = {
  id: string;
  title: string;
  icon: string;
  position: DesktopPosition;
  isSystem?: boolean;
  iconFrameClassName?: string;
};

export type PageShortcutItem = DesktopShortcutBase & {
  kind: 'page';
  pageId: PageType;
};

export type BrowserShortcutItem = DesktopShortcutBase & {
  kind: 'browser';
  browserAppId: BrowserAppId;
};

export type FolderShortcutItem = DesktopShortcutBase & {
  kind: 'folder';
  folderId: string;
  contentType: FolderContentType;
  mutable?: boolean;
};

export type CodeShortcutItem = DesktopShortcutBase & {
  kind: 'code';
  workspaceId: CodeWorkspaceId;
};

export type DesktopShortcutItem =
  | PageShortcutItem
  | BrowserShortcutItem
  | FolderShortcutItem
  | CodeShortcutItem;

export interface DesktopNote {
  id: string;
  title: string;
  content: string;
  color: NoteColorId;
  position: DesktopPosition;
  zIndex: number;
  surfaceVisible: boolean;
}

type WindowType = 'pages' | 'folder' | 'browser' | 'code' | 'note';

interface WindowBounds {
  position: DesktopPosition;
  size: { w: number; h: number } | null;
}

interface BaseWindow {
  id: string;
  type: WindowType;
  title: string;
  icon: string;
  position: DesktopPosition;
  size: { w: number; h: number } | null;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  prevBounds?: WindowBounds;
}

export interface PagesWindow extends BaseWindow {
  type: 'pages';
  tabs: PageTab[];
  activeTabId: PageType | null;
}

export interface FolderWindow extends BaseWindow {
  type: 'folder';
  contentType: FolderContentType;
  folderId: string;
}

export interface BrowserWindow extends BaseWindow {
  type: 'browser';
  browserAppId: BrowserAppId;
  url: string;
}

export interface CodeWindow extends BaseWindow {
  type: 'code';
  workspaceId: CodeWorkspaceId;
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

export interface NoteWindow extends BaseWindow {
  type: 'note';
  noteId: string;
}

export type AnyWindow =
  | PagesWindow
  | FolderWindow
  | BrowserWindow
  | CodeWindow
  | NoteWindow;
