import { atom } from "recoil";

export interface Tab {
  title: string;
  imageUrl: string;
  content: React.ReactNode;
}
export const tabsState = atom<Tab[]>({
  key: "tabsState",
  default: [],
});
