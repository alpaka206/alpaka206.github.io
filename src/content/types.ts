/**
 * Content model. Everything the site says lives in src/content as plain data,
 * so the desktop shell, the phone shell and the prerendered text version all
 * read the same facts. Copy follows the owner's style guide: no spaced middle
 * dot or em dash as separators (enforced by content.test.ts).
 */

/** Key into src/media/manifest.json, e.g. 'screens/mearri'. */
export type MediaKey = string;

export interface Link {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
  /** Project the number comes from. */
  project?: ProjectSlug;
}

/** A bullet may open with a bold keyword: "중복 발송 차단." then the sentence. */
export type Bullet = string | { strong: string; text: string };

export interface FlowNode {
  title: string;
  body: string;
  /** The one highlighted (blue) box of a diagram. */
  key?: boolean;
  /** Several inputs that merge into the next arrow (drawn as a stack). */
  stack?: { title: string; body: string }[];
}

export interface FlowLane {
  label?: string;
  nodes: FlowNode[];
  /** edges[i] labels the arrow between nodes[i] and nodes[i + 1]. */
  edges: string[];
}

export type Block =
  | { type: 'text'; title?: string; body: string }
  | { type: 'bullets'; title?: string; items: Bullet[] }
  | { type: 'metrics'; items: Stat[] }
  | { type: 'callout'; title: string; body: string }
  | { type: 'flow'; title?: string; lanes: FlowLane[]; note?: string }
  | {
      type: 'chart';
      title: string;
      unit: string;
      ticks: number[];
      /** A bar from 0 to `value`; `rangeTo` extends it as a lighter range (2~3시간). */
      rows: { label: string; value: number; rangeTo?: number; text: string; highlight?: boolean }[];
    }
  | {
      type: 'cards';
      title?: string;
      items: { tone: 'cause' | 'fix' | 'result' | 'plain'; title: string; subtitle?: string; body: string }[];
    }
  | { type: 'steps'; title?: string; items: { title: string; items: string[] }[] }
  | {
      type: 'compare';
      title: string;
      body?: string;
      before: { title: string; rows: { label: string; value: string }[] };
      after: { title: string; caption: string; rows: { label: string; value: string }[] };
    }
  | { type: 'split'; title: string; body: string; columns: { title: string; body: string }[] }
  | { type: 'media'; src: MediaKey; alt: string; frame: 'browser' | 'phone' | 'plain' }
  | { type: 'columns'; columns: Block[][] };

export type ProjectSlug =
  | 'eastaid'
  | 'premiere-plugin'
  | 'sales-automation'
  | 'mearri'
  | 'alarmtalk'
  | 'harucut'
  | 'global-web-qa'
  | 'image-qa'
  | 'comatching'
  | 'bucheon'
  | 'share-it'
  | 'saecha';

export type ProjectGroupId = 'eastaid' | 'estsoft' | 'live' | 'ptkorea' | 'team';

export interface ProjectGroup {
  id: ProjectGroupId;
  title: string;
  period?: string;
}

export interface Project {
  slug: ProjectSlug;
  /** Display title, as in the PDF page header. */
  title: string;
  /** Descriptive Korean name used in lists and search. */
  name: string;
  group: ProjectGroupId;
  /** Header line on the right of the PDF page, e.g. "이스트소프트 / 서비스 중". */
  meta: string;
  period?: string;
  /** One-line technical summary (table of contents middle column). */
  summary: string;
  /** Short result (table of contents right column). */
  highlight?: string;
  /** Lead sentence; "\n" marks the designed line break. */
  lead: string;
  icon: MediaKey;
  /** Image used for thumbnails, Quick Look and gallery view. */
  cover?: MediaKey;
  tags: string[];
  links: Link[];
  blocks: Block[];
  /** Extra search terms that do not appear in the copy. */
  keywords?: string[];
  /** Page numbers of the matching pages in the portfolio PDF (1-based). */
  pdfPages?: number[];
}

export interface Company {
  name: string;
  period: string;
  org: string;
  summary: string;
  duties?: { service: string; text: string }[];
}

export interface Award {
  date: string;
  title: string;
  issuer: string;
  images: MediaKey[];
}

export interface Activity {
  title: string;
  period: string;
  body: string;
}

export interface Certificate {
  title: string;
  date: string;
  issuer: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}
