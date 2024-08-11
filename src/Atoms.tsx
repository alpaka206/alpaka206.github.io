import { atom } from "recoil";

export interface Tab {
  title: string;
  imageUrl: string;
  content: React.ReactNode;
}

export interface ZIndexStateType {
  pageZIndex: number;
  folderZIndex: number;
}

export const tabsState = atom<Tab[]>({
  key: "tabsState",
  default: [],
});

export const ZIndexState = atom<ZIndexStateType>({
  key: "ZIndexState",
  default: {
    pageZIndex: 1000,
    folderZIndex: 999,
  },
});
