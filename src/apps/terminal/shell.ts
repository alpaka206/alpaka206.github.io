import { CAREER, PROFILE, STATS } from '@/content/profile';
import { getProject, PROJECTS } from '@/content/projects';
import type { Company } from '@/content/types';
import { APPS, type AppId, type AppProps, type FinderLocation } from '@/os/apps';
import { squash } from '@/os/search';
import { APPEARANCES, WALLPAPERS, type Appearance, type WallpaperId } from '@/os/settings';
import { SITE } from '../settings/site';
import { absolutePath, entryAt, HOME, resolvePath, type Entry, type Opener } from './files';

/**
 * A pure zsh look-alike: `run` turns one input line into output lines, a new
 * working directory and at most one side effect for the window to perform
 * (open an app, clear the screen…). Nothing here touches the DOM or a store,
 * so every command is covered by shell.test.ts.
 */

type Tone = 'dim' | 'bold' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan';
type Span = string | { text: string; tone: Tone };
export type Line = Span[];

const USER = 'gyuwon';
const HOST = 'alpaka';

export interface ShellContext {
  cwd: readonly string[];
  /** Everything entered so far, oldest first, including the line being run (as zsh records it). */
  history: readonly string[];
  now: Date;
  /** Terminal width in columns; `ls` lays out its names to fit. */
  cols: number;
  appearance: Appearance;
  wallpaper: WallpaperId;
  /** IANA zone for `date`; defaults to the browser's. */
  timeZone?: string;
}

export type Effect =
  | { type: 'clear' }
  | { type: 'exit' }
  | { type: 'open'; app: AppId; props?: Partial<AppProps[AppId]> }
  | { type: 'award'; index: number }
  | { type: 'appearance'; value: Appearance }
  | { type: 'wallpaper'; value: WallpaperId };

interface Result {
  lines: Line[];
  cwd: readonly string[];
  effect?: Effect;
}

const tone = (text: string, t: Tone): Span => ({ text, tone: t });

/** zsh's default macOS prompt, `%n@%m %1~ %# `. */
export const prompt = (cwd: readonly string[]) => `${USER}@${HOST} ${cwd.at(-1) ?? '~'} % `;

/** Shown when a session starts. login(1) prints its date in English on every Mac: "Sun Nov 22 03:34:08". */
export function banner(now: Date): Line[] {
  const part = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', options).format(now);
  const time = part({ hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const stamp = `${part({ weekday: 'short' })} ${part({ month: 'short' })} ${part({ day: 'numeric' }).padStart(2)} ${time}`;
  return [
    [`Last login: ${stamp} on ttys000`],
    [tone('help를 입력하면 쓸 수 있는 명령을 볼 수 있어요. Tab으로 자동 완성, ↑↓로 이전 명령.', 'dim')],
  ];
}

/** Own keys only, so input like "constructor" never reaches Object.prototype. */
const has = <K extends string>(record: Readonly<Record<K, unknown>>, key: string): key is K => Object.hasOwn(record, key);

// ---------- parsing ----------

/** Splits a line into words, honouring '…' and "…" and expanding $VARS outside single quotes. */
export function tokenize(input: string, env: Readonly<Record<string, string>>): string[] {
  const words: string[] = [];
  let word = '';
  let started = false;
  let quote: string | null = null;
  for (let i = 0; i < input.length; i++) {
    const char = input[i]!;
    if (char === quote) {
      quote = null;
      continue;
    }
    if (!quote && (char === '"' || char === "'")) {
      quote = char;
      started = true;
      continue;
    }
    if (!quote && /\s/.test(char)) {
      if (started) words.push(word);
      word = '';
      started = false;
      continue;
    }
    const variable = quote !== "'" && char === '$' ? /^\$([A-Za-z_]\w*)/.exec(input.slice(i)) : null;
    if (variable) {
      const name = variable[1]!;
      word += has(env, name) ? env[name] : '';
      i += variable[0].length - 1;
    } else {
      word += char;
    }
    started = true;
  }
  if (started) words.push(word);
  return words;
}

// ---------- formatting helpers ----------

/** 로 after a vowel or ㄹ, 으로 after any other final consonant ("다크로", "자동으로"). */
export function withRo(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return `${word}(으)로`;
  const final = code % 28;
  return word + (final === 0 || final === 8 ? '로' : '으로');
}

const byName = (a: Entry, b: Entry) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

/**
 * BSD `ls` layout: names sorted in C order, column width rounded up to the
 * next tab stop (8), filled top to bottom then left to right.
 */
export function columns(names: readonly Span[], width: number): Line[] {
  const text = (span: Span) => (typeof span === 'string' ? span : span.text);
  if (!names.length) return [];
  const longest = Math.max(...names.map((name) => text(name).length));
  const columnWidth = (Math.floor(longest / 8) + 1) * 8;
  const perRow = Math.max(1, Math.floor(width / columnWidth));
  const rows = Math.ceil(names.length / perRow);
  const lines: Line[] = [];
  for (let row = 0; row < rows; row++) {
    const line: Line = [];
    for (let col = 0; col * rows + row < names.length; col++) {
      const name = names[col * rows + row]!;
      const last = (col + 1) * rows + row >= names.length;
      line.push(name);
      if (!last) line.push(' '.repeat(columnWidth - text(name).length));
    }
    lines.push(line);
  }
  return lines;
}

const entryLabel = (entry: Entry): Span => (entry.kind === 'dir' ? tone(`${entry.name}/`, 'blue') : entry.name);

// ---------- commands ----------

type Command = (args: string[], ctx: ShellContext) => Omit<Result, 'cwd'> & { cwd?: readonly string[] };

const out = (...lines: (string | Line)[]) => ({ lines: lines.map((line) => (typeof line === 'string' ? [line] : line)) });

const HELP: [string, string][] = [
  ['help', '쓸 수 있는 명령을 봅니다'],
  ['ls [폴더]', '폴더 안을 봅니다'],
  ['cd <폴더>', '폴더를 옮깁니다'],
  ['pwd', '지금 폴더의 경로를 봅니다'],
  ['cat <파일>', '파일 내용을 봅니다'],
  ['open <이름>', '앱, 프로젝트, 파일을 엽니다. open . 은 Finder'],
  ['whoami', '사용자 이름을 봅니다'],
  ['neofetch', '프로필을 한눈에 봅니다'],
  ['git log', '경력을 커밋 기록으로 봅니다 (--oneline)'],
  ['history', '입력한 명령을 봅니다'],
  ['clear', '화면을 지웁니다 (⌘K, ⌃L)'],
  ['date', '지금 날짜와 시각을 봅니다'],
  ['echo <글>', '글을 그대로 출력합니다'],
  ['theme <모드>', '화면 모드를 바꿉니다: auto, light, dark'],
  ['wallpaper [id]', '배경화면을 보거나 바꿉니다'],
  ['exit', '터미널을 닫습니다'],
];

const FINDER_FOR: Record<string, FinderLocation> = { projects: 'projects', awards: 'awards' };

function openerEffect(opener: Opener): Effect {
  return 'award' in opener ? { type: 'award', index: opener.award } : { type: 'open', app: opener.app, props: opener.props };
}

/** Apps `open` can start by name; the portfolio viewer always needs a project. */
const OPENABLE = Object.values(APPS).filter((app) => app.id !== 'portfolio');

/** `open -a 메모`, `open notes`, `open Safari`: app ids and their Korean names. */
function findApp(name: string): AppId | undefined {
  const wanted = squash(name);
  return OPENABLE.find((app) => app.id === wanted || squash(app.name) === wanted)?.id;
}

function hash(text: string) {
  // FNV-1a: a stable, content-derived stand-in for a commit id.
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(16).padStart(8, '0');
}

const commitId = (company: Company) => [0, 1, 2, 3, 4].map((salt) => hash(`${salt}:${company.name}:${company.period}`)).join('');

const startOf = (period: string) => period.split(' - ')[0] ?? period;

function gitLog(oneline: boolean): Line[] {
  const head = (first: boolean): Span[] =>
    first ? [' ', tone('(', 'yellow'), tone('HEAD -> ', 'cyan'), tone('main', 'green'), tone(')', 'yellow')] : [];
  if (oneline) {
    return CAREER.map((job, i) => [tone(commitId(job).slice(0, 7), 'yellow'), ...head(i === 0), ` ${startOf(job.period)} ${job.name}, ${job.summary}`]);
  }
  return CAREER.flatMap((job, i) => [
    ...(i ? [[]] : []),
    [tone(`commit ${commitId(job)}`, 'yellow'), ...head(i === 0)],
    [`Author: ${PROFILE.name} <${PROFILE.email}>`],
    [`Date:   ${job.period}`],
    [],
    [`    ${job.name}, ${job.org}`],
    [],
    [`    ${job.summary}`],
    ...(job.duties ?? []).map((duty) => [`    ${duty.service}: ${duty.text}`]),
  ]);
}

// The alpaca from the approved Terminal artboard (D11).
const ALPACA = [
  '        ,   ,',
  '       (\\___/)',
  '       ( o o )',
  '        \\ v /',
  '         | |',
  '         | |_______',
  '         |         \\',
  '         |  _____  |',
  '         |_|     |_|',
];

function neofetch(): Line[] {
  const field = (key: string, value: string): Line => [tone(key.padEnd(10), 'cyan'), value];
  const info: Line[] = [
    [tone(USER, 'bold'), '@', tone(HOST, 'bold')],
    ['-'.repeat(USER.length + HOST.length + 1)],
    field('OS', `Portfolio ${SITE.version}`),
    field('Host', `${PROFILE.current.company} ${PROFILE.current.team}`),
    field('Role', PROFILE.role),
    field('Career', `${CAREER.length}곳, ${startOf(CAREER.at(-1)?.period ?? '')} 시작`),
    field('Shell', 'zsh'),
    field('Projects', String(PROJECTS.length)),
    ...STATS.map((stat, i) => field(i ? '' : 'Stats', `${stat.value}, ${stat.label}`)),
    field('Mail', PROFILE.email),
    field('GitHub', PROFILE.github.label),
    field('Blog', PROFILE.blog.label),
    [],
    (['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'] as const).map((t) => tone('███', t)),
  ];
  const rows = Math.max(ALPACA.length, info.length);
  return Array.from({ length: rows }, (_, i) => [tone((ALPACA[i] ?? '').padEnd(24), 'yellow'), ...(info[i] ?? [])]);
}

function koreanDate(now: Date, timeZone?: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZone,
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  const zoneId = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zone =
    zoneId === 'Asia/Seoul'
      ? 'KST'
      : (new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value ?? '');
  const pad = (value: string | undefined) => (value ?? '').padStart(2, '0');
  // `date` under LANG=ko_KR.UTF-8 on macOS: "2026년 11월 22일 일요일 03시 34분 08초 KST".
  return `${parts.year}년 ${parts.month}월 ${parts.day}일 ${parts.weekday} ${pad(parts.hour)}시 ${pad(parts.minute)}분 ${pad(parts.second)}초 ${zone}`;
}

const COMMANDS = {
  help: () =>
    out(
      '쓸 수 있는 명령:',
      ...HELP.map(([name, text]): Line => ['  ', tone(name.padEnd(16), 'bold'), text]),
      '',
      [tone('Tab으로 자동 완성, ↑↓로 이전 명령, ⌃C로 입력 취소.', 'dim')],
    ),

  ls: (args, ctx) => {
    const targets = args.filter((arg) => !arg.startsWith('-'));
    const listing = (entry: Entry) => (entry.kind === 'dir' ? columns(entry.children.toSorted(byName).map(entryLabel), ctx.cols) : [[entry.name]]);
    const here = entryAt(ctx.cwd);
    if (!targets.length) return { lines: here ? listing(here) : [] };
    const lines: Line[] = [];
    for (const target of targets) {
      const path = resolvePath(ctx.cwd, target);
      const entry = path && entryAt(path);
      if (!entry) {
        lines.push([`ls: ${target}: No such file or directory`]);
        continue;
      }
      if (targets.length > 1 && entry.kind === 'dir') lines.push(...(lines.length ? [[]] : []), [`${target}:`]);
      lines.push(...listing(entry));
    }
    return { lines };
  },

  cd: (args, ctx) => {
    const target = args[0] ?? '~';
    const path = resolvePath(ctx.cwd, target);
    const entry = path && entryAt(path);
    if (!entry) return out(`cd: no such file or directory: ${target}`);
    if (entry.kind === 'file') return out(`cd: not a directory: ${target}`);
    return { lines: [], cwd: path };
  },

  pwd: (_, ctx) => out(absolutePath(ctx.cwd)),

  cat: (args, ctx) => {
    if (!args.length) return out('usage: cat [-belnstuv] [file ...]');
    const lines: Line[] = [];
    for (const target of args) {
      const path = resolvePath(ctx.cwd, target);
      const entry = path && entryAt(path);
      if (!entry) lines.push([`cat: ${target}: No such file or directory`]);
      else if (entry.kind === 'dir') lines.push([`cat: ${target}: Is a directory`]);
      else lines.push(...entry.read().map((line) => [line]));
    }
    return { lines };
  },

  open: (args, ctx) => {
    const target = args.filter((arg) => arg !== '-a').join(' ');
    if (!target) return out('Usage: open [-a <application>] [filenames]');
    if (/^https?:\/\//i.test(target)) return { lines: [], effect: { type: 'open', app: 'safari', props: { url: target } } };
    const app = findApp(target);
    if (app) return { lines: [], effect: { type: 'open', app } };
    const project = getProject(target);
    if (project) return { lines: [], effect: { type: 'open', app: 'portfolio', props: { slug: project.slug } } };
    const path = resolvePath(ctx.cwd, target);
    const entry = path && entryAt(path);
    if (!path || !entry) return out(`The file ${path ? absolutePath(path) : target} does not exist.`);
    if (entry.kind === 'file') return { lines: [], effect: openerEffect(entry.opens) };
    const folder = path.at(-1) ?? '';
    return { lines: [], effect: { type: 'open', app: 'finder', props: { location: has(FINDER_FOR, folder) ? FINDER_FOR[folder] : 'documents' } } };
  },

  whoami: () => out(USER),

  neofetch: () => ({ lines: neofetch() }),

  git: (args) => {
    if (args[0] === 'log') return { lines: gitLog(args.includes('--oneline')) };
    if (!args.length) return out('usage: git [-v | --version] [-h | --help] <command> [<args>]');
    return out(`git: '${args[0]}' is not a git command. See 'git --help'.`);
  },

  history: (_, ctx) => out(...ctx.history.map((line, i) => `${String(i + 1).padStart(5)}  ${line}`)),

  clear: () => ({ lines: [], effect: { type: 'clear' } }),

  date: (_, ctx) => out(koreanDate(ctx.now, ctx.timeZone)),

  echo: (args) => out(args.join(' ')),

  theme: (args, ctx) => {
    const [value] = args;
    const usage = '사용법: theme <auto|light|dark>';
    if (!value) return out(`지금 화면 모드: ${APPEARANCES[ctx.appearance]} (${ctx.appearance})`, usage);
    if (!has(APPEARANCES, value)) return out(`theme: 알 수 없는 모드예요: ${value}`, usage);
    return { ...out(`화면 모드를 ${withRo(APPEARANCES[value])} 바꿨어요.`), effect: { type: 'appearance', value } };
  },

  wallpaper: (args, ctx) => {
    const [value] = args;
    const list = (Object.keys(WALLPAPERS) as WallpaperId[]).map((id): Line => [
      id === ctx.wallpaper ? tone('* ', 'green') : '  ',
      tone(id.padEnd(13), 'bold'),
      WALLPAPERS[id].label,
    ]);
    if (!value) return out(...list, '', '사용법: wallpaper <id>');
    if (!has(WALLPAPERS, value)) return out(`wallpaper: 없는 배경화면이에요: ${value}`, ...list);
    return { ...out(`배경화면을 ${withRo(WALLPAPERS[value].label)} 바꿨어요.`), effect: { type: 'wallpaper', value } };
  },

  sudo: (args) => {
    if (!args.length) return out('usage: sudo -h | -K | -k | -V');
    if (args.join(' ') === 'hire-me') {
      return {
        ...out('좋아요, Mail에서 새 메시지를 열었어요.'),
        effect: { type: 'open', app: 'mail', props: { subject: '채용 관련 문의드립니다' } },
      };
    }
    return out(`${USER} is not in the sudoers file.  This incident will be reported.`, [tone('관리자 권한은 드릴 수 없지만, sudo hire-me 는 언제든 실행할 수 있어요.', 'dim')]);
  },

  exit: () => ({ lines: [], effect: { type: 'exit' } }),
} satisfies Record<string, Command>;

const COMMAND_NAMES = Object.keys(COMMANDS).sort();

export function run(input: string, ctx: ShellContext): Result {
  const env = { USER, HOME, SHELL: '/bin/zsh', LANG: 'ko_KR.UTF-8', PWD: absolutePath(ctx.cwd) };
  const [name, ...args] = tokenize(input, env);
  if (!name) return { lines: [], cwd: ctx.cwd };
  if (!has(COMMANDS, name)) return { lines: [[`zsh: command not found: ${name}`]], cwd: ctx.cwd };
  const result: ReturnType<Command> = COMMANDS[name](args, ctx);
  return { ...result, cwd: result.cwd ?? ctx.cwd };
}

// ---------- tab completion ----------

interface Completion {
  /** The input with the last word completed as far as it is unambiguous. */
  input: string;
  /** Every match, shown under the prompt when more than one remains. */
  options: Span[];
}

function pathCandidates(word: string, cwd: readonly string[], dirsOnly: boolean): string[] {
  const slash = word.lastIndexOf('/');
  const folder = word.slice(0, slash + 1);
  const base = word.slice(slash + 1);
  const path = resolvePath(cwd, folder || '.');
  const dir = path && entryAt(path);
  if (!dir || dir.kind !== 'dir') return [];
  return dir.children
    .toSorted(byName)
    .filter((child) => child.name.startsWith(base) && (!dirsOnly || child.kind === 'dir'))
    .map((child) => folder + child.name + (child.kind === 'dir' ? '/' : ''));
}

function candidatesFor(words: string[], word: string, cwd: readonly string[]): string[] {
  const [command, sub] = words;
  const starting = (list: readonly string[]) => list.filter((item) => item.startsWith(word));
  if (!command) return starting(COMMAND_NAMES);
  switch (command) {
    case 'cd':
    case 'ls':
      return pathCandidates(word, cwd, true);
    case 'cat':
      return pathCandidates(word, cwd, false);
    case 'open': {
      const names = word.includes('/') ? [] : starting([...PROJECTS.map((p) => p.slug), ...OPENABLE.map((app) => app.id)]);
      return [...new Set([...pathCandidates(word, cwd, false), ...names])];
    }
    case 'theme':
      return words.length === 1 ? starting(Object.keys(APPEARANCES)) : [];
    case 'wallpaper':
      return words.length === 1 ? starting(Object.keys(WALLPAPERS)) : [];
    case 'git':
      return words.length === 1 ? starting(['log']) : sub === 'log' ? starting(['--oneline']) : [];
    case 'sudo':
      return words.length === 1 ? starting(['hire-me']) : [];
    default:
      return [];
  }
}

const commonPrefix = (items: string[]) =>
  items.reduce((prefix, item) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === item[i]) i++;
    return prefix.slice(0, i);
  });

export function complete(input: string, cwd: readonly string[]): Completion {
  const word = /\S*$/.exec(input)?.[0] ?? '';
  const head = input.slice(0, input.length - word.length);
  const words = head.trim().split(/\s+/).filter(Boolean);
  const candidates = candidatesFor(words, word, cwd);
  if (!candidates.length) return { input, options: [] };
  if (candidates.length === 1) {
    const only = candidates[0]!;
    return { input: head + only + (only.endsWith('/') ? '' : ' '), options: [] };
  }
  const label = (item: string): Span => {
    const name = item.replace(/\/$/, '').split('/').pop() ?? item;
    return item.endsWith('/') ? tone(`${name}/`, 'blue') : name;
  };
  return { input: head + commonPrefix(candidates), options: candidates.map(label) };
}
