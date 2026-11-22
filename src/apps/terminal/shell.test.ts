import { describe, expect, it } from 'vitest';
import { AWARDS, CAREER, PROFILE, STATS } from '@/content/profile';
import { PROJECTS } from '@/content/projects';
import { awardFileName } from './files';
import { banner, columns, complete, prompt, run, tokenize, withRo, type Line, type ShellContext } from './shell';

const text = (line: Line) => line.map((span) => (typeof span === 'string' ? span : span.text)).join('');
const ctx = (patch: Partial<ShellContext> = {}): ShellContext => ({
  cwd: [],
  history: [],
  now: new Date('2026-11-21T18:34:08Z'),
  cols: 80,
  appearance: 'auto',
  wallpaper: 'glass',
  timeZone: 'Asia/Seoul',
  ...patch,
});
const lines = (input: string, patch?: Partial<ShellContext>) => run(input, ctx(patch)).lines.map(text);

describe('prompt and parsing', () => {
  it('prints the default macOS zsh prompt with the last path component', () => {
    expect(prompt([])).toBe('gyuwon@alpaka ~ % ');
    expect(prompt(['projects'])).toBe('gyuwon@alpaka projects % ');
  });

  it('splits words with quotes and expands variables outside single quotes', () => {
    const env = { USER: 'gyuwon' };
    expect(tokenize(`echo "hello  world" 'a b' c`, env)).toEqual(['echo', 'hello  world', 'a b', 'c']);
    expect(tokenize(`echo $USER '$USER' "$USER!" $constructor`, env)).toEqual(['echo', 'gyuwon', '$USER', 'gyuwon!', '']);
    expect(tokenize(`echo ''`, env)).toEqual(['echo', '']);
  });

  it('answers unknown commands the way zsh does, including prototype names', () => {
    expect(lines('foo')).toEqual(['zsh: command not found: foo']);
    expect(lines('constructor')).toEqual(['zsh: command not found: constructor']);
    expect(lines('   ')).toEqual([]);
  });

  it('starts a session with the login line and a hint', () => {
    const [login, hint] = banner(new Date(2026, 10, 2, 9, 1, 2)).map(text);
    expect(login).toBe('Last login: Mon Nov  2 09:01:02 on ttys000');
    expect(hint).toContain('help');
  });
});

describe('files', () => {
  it('lists home like BSD ls, directories marked', () => {
    expect(lines('ls')).toEqual(['README.md       about.md        awards/         notes/          projects/']);
  });

  it('lays out names column by column within the width', () => {
    const out = columns(['a', 'b', 'c', 'd', 'e'], 16).map(text);
    expect(out).toEqual(['a       d', 'b       e', 'c']);
  });

  it('lists every project as a markdown file', () => {
    const names = lines('ls projects').join(' ').split(/\s+/).filter(Boolean);
    expect(names.sort()).toEqual(PROJECTS.map((p) => `${p.slug}.md`).sort());
  });

  it('moves between folders and reports errors with zsh wording', () => {
    const into = run('cd projects', ctx());
    expect(into.cwd).toEqual(['projects']);
    expect(lines('pwd', { cwd: into.cwd })).toEqual(['/Users/gyuwon/projects']);
    expect(run('cd ..', ctx({ cwd: ['projects'] })).cwd).toEqual([]);
    expect(run('cd', ctx({ cwd: ['notes'] })).cwd).toEqual([]);
    expect(run('cd ~/awards/', ctx()).cwd).toEqual(['awards']);
    expect(run('cd ../..', ctx({ cwd: ['notes'] })).cwd).toEqual([]);
    expect(lines('cd nowhere')).toEqual(['cd: no such file or directory: nowhere']);
    expect(lines('cd README.md')).toEqual(['cd: not a directory: README.md']);
    expect(lines('ls nowhere')).toEqual(['ls: nowhere: No such file or directory']);
  });

  it('cats the how-built note, the profile and a project from content', () => {
    expect(lines('cat README.md')[0]).toBe('# 이 사이트를 만든 방법');
    const about = lines('cat about.md');
    expect(about).toContain(PROFILE.headline);
    expect(about).toContain(`- ${STATS[0]!.value}: ${STATS[0]!.label}`);
    const mearri = lines('cat mearri.md', { cwd: ['projects'] });
    expect(mearri[0]).toBe('# Mearri');
    expect(mearri).toContain('영상을 올리면 워커가 자막을 만들어,');
    expect(mearri.at(-1)).toMatch(/^태그: Next\.js, TypeScript/);
    expect(lines('cat nope.md')).toEqual(['cat: nope.md: No such file or directory']);
    expect(lines('cat projects')).toEqual(['cat: projects: Is a directory']);
  });
});

describe('open', () => {
  const effect = (input: string, patch?: Partial<ShellContext>) => run(input, ctx(patch)).effect;

  it('opens projects, apps, files and folders', () => {
    expect(effect('open mearri')).toEqual({ type: 'open', app: 'portfolio', props: { slug: 'mearri' } });
    expect(effect('open -a Safari')).toEqual({ type: 'open', app: 'safari' });
    expect(effect('open 시스템 설정')).toEqual({ type: 'open', app: 'settings' });
    expect(effect('open README.md')).toEqual({ type: 'open', app: 'notes', props: { note: 'how-built' } });
    expect(effect('open .', { cwd: ['projects'] })).toEqual({ type: 'open', app: 'finder', props: { location: 'projects' } });
    expect(effect(`open awards/${awardFileName(AWARDS[1]!)}`)).toEqual({ type: 'award', index: 1 });
    expect(effect('open https://alpaka206.vercel.app/')).toEqual({ type: 'open', app: 'safari', props: { url: 'https://alpaka206.vercel.app/' } });
  });

  it('never opens the portfolio viewer without a project', () => {
    expect(effect('open portfolio')).toBeUndefined();
    expect(lines('open portfolio')).toEqual(['The file /Users/gyuwon/portfolio does not exist.']);
  });
});

describe('profile commands', () => {
  it('tells the career as git history, newest first, HEAD on the current job', () => {
    const log = lines('git log --oneline');
    expect(log).toHaveLength(CAREER.length);
    expect(log[0]).toMatch(/^[0-9a-f]{7} \(HEAD -> main\) 2026\.10\.13 이스트에이드, /);
    expect(log[1]).not.toContain('HEAD');
    expect(log.at(-1)).toContain(CAREER.at(-1)!.name);
    expect(lines('git log')).toContain(`Author: ${PROFILE.name} <${PROFILE.email}>`);
    expect(lines('git push')[0]).toContain("'push' is not a git command");
  });

  it('shows neofetch facts that all come from content', () => {
    const out = lines('neofetch').join('\n');
    expect(out).toContain(`Projects  ${PROJECTS.length}`);
    expect(out).toContain(PROFILE.email);
    for (const stat of STATS) expect(out).toContain(stat.value);
  });

  it('prints the date the way macOS does under ko_KR', () => {
    expect(lines('date')).toEqual(['2026년 11월 22일 일요일 03시 34분 08초 KST']);
  });

  it('numbers history like zsh', () => {
    expect(lines('history', { history: ['ls', 'history'] })).toEqual(['    1  ls', '    2  history']);
  });

  it('echoes and answers whoami', () => {
    expect(lines('echo "안녕하세요"  $SHELL')).toEqual(['안녕하세요 /bin/zsh']);
    expect(lines('whoami')).toEqual(['gyuwon']);
  });
});

describe('settings and session effects', () => {
  it('switches the appearance and wallpaper with correct Korean particles', () => {
    expect(run('theme dark', ctx())).toMatchObject({ lines: [['화면 모드를 다크로 바꿨어요.']], effect: { type: 'appearance', value: 'dark' } });
    expect(lines('theme auto')).toEqual(['화면 모드를 자동으로 바꿨어요.']);
    expect(run('theme toString', ctx()).effect).toBeUndefined();
    expect(run('wallpaper ridge', ctx()).effect).toEqual({ type: 'wallpaper', value: 'ridge' });
    expect(lines('wallpaper')[0]).toMatch(/^\* glass\s+유리 물결$/);
  });

  it('plays along with sudo, and hire-me opens Mail', () => {
    expect(run('sudo hire-me', ctx()).effect).toEqual({ type: 'open', app: 'mail', props: { subject: '채용 관련 문의드립니다' } });
    expect(lines('sudo rm -rf /')[0]).toBe('gyuwon is not in the sudoers file.  This incident will be reported.');
  });

  it('asks the window to clear or close', () => {
    expect(run('clear', ctx()).effect).toEqual({ type: 'clear' });
    expect(run('exit', ctx()).effect).toEqual({ type: 'exit' });
  });

  it('picks 로 or 으로 from the last syllable', () => {
    expect(['다크', '라이트', '자동', '유리 물결', '능선, 새벽'].map(withRo)).toEqual(['다크로', '라이트로', '자동으로', '유리 물결로', '능선, 새벽으로']);
  });
});

describe('tab completion', () => {
  it('completes a unique command, folder or file', () => {
    expect(complete('neo', []).input).toBe('neofetch ');
    expect(complete('cd pro', []).input).toBe('cd projects/');
    expect(complete('cat projects/mea', []).input).toBe('cat projects/mearri.md ');
    expect(complete('open hai', []).input).toBe('open hai');
    expect(complete('theme d', []).input).toBe('theme dark ');
    expect(complete('git log --o', []).input).toBe('git log --oneline ');
  });

  it('extends to the common prefix and lists what is left', () => {
    const result = complete('c', []);
    expect(result.input).toBe('c');
    expect(result.options.map((o) => (typeof o === 'string' ? o : o.text))).toEqual(['cat', 'cd', 'clear']);
    expect(complete('cat a', []).options.map((o) => (typeof o === 'string' ? o : o.text))).toEqual(['about.md', 'awards/']);
  });

  it('only offers folders to cd', () => {
    expect(complete('cd ', []).options.map((o) => (typeof o === 'string' ? o : o.text))).toEqual(['awards/', 'notes/', 'projects/']);
  });
});
