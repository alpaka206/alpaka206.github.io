import { atom } from "recoil";

export interface Tab {
  title: string;
  imageUrl: string;
  content: React.ReactNode;
}
export interface Tabs {
  tabs: Tab[];
  activeTabIndex: number | null;
}

export interface ZIndexStateType {
  pageZIndex: number;
  folderZIndex: number;
}

export interface TaskbarItem {
  id: string;
  imageUrl: string;
}

export interface Taskbar {
  taskbars: TaskbarItem[];
  activeTaskbar: string | null;
}

export const tabsState = atom<Tabs>({
  key: "tabsState",
  default: {
    tabs: [],
    activeTabIndex: null,
  },
});

export const ZIndexState = atom<ZIndexStateType>({
  key: "ZIndexState",
  default: {
    pageZIndex: 1000,
    folderZIndex: 999,
  },
});

export const taskbarState = atom<Taskbar>({
  key: "taskbarState",
  default: {
    taskbars: [],
    activeTaskbar: null,
  },
});
