export type NavItem = { name: string; target: string };

export type Badge = { label: string; imgUrl: string };

export type Project = {
  title: string;
  subtitle?: string;
  role: string;
  points: string[];
  stacks: string[];
  link?: string;
};

export type About = {
  name: string;
  role: string;
  birth: string;
  avatarSrc: string;
  paragraphs: string[];
};

export type Contact = {
  phone: string;
  email: string;
};

export type CareerEntry = {
  org: string;
  period: string;
  bullets: string[];
};

export type EducationEntry = {
  lines: string[];
};

export type ExperienceSection = {
  title: string;
  lines: string[];
};
