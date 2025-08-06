import type { Chip } from './Chips';

export type ProjectSection = {
  title: string;
  bullets?: string[];
  images?: string[];
};

export type ProjectData = {
  title: string;
  hero: string;
  skills?: readonly Chip[];
  tools?: readonly Chip[];
  period?: string;
  membersLabel?: string;
  members?: string;
  roles?: readonly Chip[];
  contribution?: string;
  result?: string | string[];
  category?: Chip;
  githubUrl?: string;
  sections?: ProjectSection[];
};
