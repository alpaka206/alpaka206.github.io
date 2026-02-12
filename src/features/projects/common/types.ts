export type Chip = Readonly<{ label: string; color?: string }>;

export type ProjectImageItem = { src: string; alt?: string };

export type ProjectSection = {
  title: string;
  bullets?: string[];
  images?: (string | ProjectImageItem)[];
};

export type ProjectData = {
  title: string;
  hero: string;
  summary?: string;
  highlights?: string[];
  responsibilities?: { title: string; items: string[] }[];
  outcomes?: string[];
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
