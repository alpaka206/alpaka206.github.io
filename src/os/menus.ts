import { PROFILE } from '@/content/profile';
import { APPS, type AppId } from './apps';

/**
 * The menu bar, per app, in the order and wording of Korean macOS. Items that
 * do something in this portfolio carry a `command`; a few without one stay as
 * disabled entries, exactly as macOS greys out what does not apply. A
 * shortcut is the menu item's key equivalent: os/keyboard.ts finds commands by
 * reading these menus, so the menu and the keyboard can never disagree.
 */
export interface MenuItem {
  label: string;
  command?: string;
  shortcut?: string;
  submenu?: MenuEntry[];
}

export type MenuEntry = MenuItem | 'separator';

export interface Menu {
  title: string;
  items: MenuEntry[];
}

const sep = 'separator' as const;

export const SYSTEM_MENU: MenuEntry[] = [
  { label: '이 개발자에 관하여', command: 'system.about' },
  sep,
  { label: '시스템 설정…', command: 'system.settings' },
  sep,
  {
    label: '최근 사용 항목',
    submenu: [
      { label: '김규원_포트폴리오.pdf', command: 'open.portfolioPdf' },
      { label: '이 사이트를 만든 방법', command: 'open.noteHowBuilt' },
    ],
  },
  sep,
  // Ships with three ASCII dots in Korean macOS 27 (every other item uses '…').
  { label: '강제 종료...', command: 'system.forceQuit', shortcut: '⌥⌘⎋' },
  sep,
  { label: '잠자기', command: 'system.sleep' },
  { label: '재시동…', command: 'system.restart' },
  { label: '시스템 종료…', command: 'system.shutdown' },
  sep,
  { label: '잠금 화면', command: 'system.lock', shortcut: '⌃⌘Q' },
  { label: `${PROFILE.name} 로그아웃…`, command: 'system.logout', shortcut: '⇧⌘Q' },
];

function appMenu(app: AppId, extra: MenuEntry[] = [], quittable = true): Menu {
  const name = APPS[app].name;
  return {
    title: name,
    items: [
      { label: `${name}에 관하여`, command: 'app.about' },
      sep,
      { label: '설정…', command: 'app.settings', shortcut: '⌘,' },
      ...extra,
      sep,
      { label: '서비스' },
      sep,
      { label: `${name} 가리기`, command: 'app.hide', shortcut: '⌘H' },
      { label: '기타 가리기', command: 'app.hideOthers', shortcut: '⌥⌘H' },
      { label: '모두 보기', command: 'app.showAll' },
      ...(quittable ? [sep, { label: `${name} 종료`, command: 'app.quit', shortcut: '⌘Q' }] : []),
    ],
  };
}

const edit: Menu = {
  title: '편집',
  items: [
    { label: '실행 취소', command: 'edit.undo', shortcut: '⌘Z' },
    { label: '실행 복귀', command: 'edit.redo', shortcut: '⇧⌘Z' },
    sep,
    { label: '오려두기', command: 'edit.cut', shortcut: '⌘X' },
    { label: '복사하기', command: 'edit.copy', shortcut: '⌘C' },
    { label: '붙여넣기', command: 'edit.paste', shortcut: '⌘V' },
    { label: '모두 선택', command: 'edit.selectAll', shortcut: '⌘A' },
    sep,
    { label: '찾기', command: 'edit.find', shortcut: '⌘F' },
  ],
};

const windowMenu: Menu = {
  title: '윈도우',
  items: [
    { label: '최소화', command: 'window.minimize', shortcut: '⌘M' },
    { label: '확대/축소', command: 'window.zoom' },
    { label: '채우기', command: 'window.fill', shortcut: '⌃🌐F' },
    { label: '가운데로', command: 'window.center', shortcut: '⌃🌐C' },
    {
      label: '이동 및 크기 조절',
      submenu: [
        { label: '왼쪽', command: 'window.tileLeft' },
        { label: '오른쪽', command: 'window.tileRight' },
      ],
    },
    sep,
    { label: '윈도우 순환', command: 'window.cycle', shortcut: '⌘`' },
    sep,
    { label: '모두 앞으로 가져오기', command: 'window.bringAll' },
  ],
};

const help = (app: AppId): Menu => ({
  title: '도움말',
  items: [
    { label: `${APPS[app].name} 도움말`, command: 'help.shortcuts' },
    { label: '텍스트 버전으로 보기', command: 'system.readerMode' },
    { label: '이 사이트의 소스 코드 보기', command: 'help.source' },
  ],
});

const viewFullScreen: MenuEntry = { label: '전체 화면 시작', command: 'view.fullScreen', shortcut: '⌃⌘F' };

const MENUS: Record<AppId, () => Menu[]> = {
  finder: () => [
    {
      title: 'Finder',
      items: [
        { label: 'Finder에 관하여', command: 'app.about' },
        sep,
        { label: '설정…', command: 'app.settings', shortcut: '⌘,' },
        sep,
        { label: '휴지통 비우기…', command: 'finder.emptyTrash', shortcut: '⇧⌘⌫' },
        sep,
        { label: 'Finder 가리기', command: 'app.hide', shortcut: '⌘H' },
        { label: '기타 가리기', command: 'app.hideOthers', shortcut: '⌥⌘H' },
        { label: '모두 보기', command: 'app.showAll' },
      ],
    },
    {
      title: '파일',
      items: [
        { label: '새로운 Finder 윈도우', command: 'finder.newWindow', shortcut: '⌘N' },
        { label: '새로운 폴더', shortcut: '⇧⌘N' },
        { label: '열기', command: 'finder.open', shortcut: '⌘O' },
        { label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' },
        sep,
        { label: '정보 가져오기', command: 'finder.getInfo', shortcut: '⌘I' },
        { label: '훑어보기', command: 'finder.quickLook', shortcut: '⌘Y' },
        sep,
        { label: '휴지통으로 이동', shortcut: '⌘⌫' },
      ],
    },
    edit,
    {
      title: '보기',
      items: [
        { label: '아이콘으로', command: 'finder.view.icons', shortcut: '⌘1' },
        { label: '목록으로', command: 'finder.view.list', shortcut: '⌘2' },
        { label: '계층으로', command: 'finder.view.columns', shortcut: '⌘3' },
        { label: '갤러리로', command: 'finder.view.gallery', shortcut: '⌘4' },
        sep,
        { label: '사이드바 가리기', command: 'finder.toggleSidebar', shortcut: '⌃⌘S' },
        { label: '미리보기 보기', command: 'finder.togglePreview', shortcut: '⇧⌘P' },
        sep,
        viewFullScreen,
      ],
    },
    {
      title: '이동',
      items: [
        { label: '뒤로', command: 'nav.back', shortcut: '⌘[' },
        { label: '앞으로', command: 'nav.forward', shortcut: '⌘]' },
        { label: '상위 폴더', command: 'finder.enclosing', shortcut: '⌘↑' },
        sep,
        { label: '최근 항목', command: 'go.recents', shortcut: '⇧⌘F' },
        { label: '문서', command: 'go.documents', shortcut: '⇧⌘O' },
        { label: '데스크탑', command: 'go.desktop', shortcut: '⇧⌘D' },
        { label: '응용 프로그램', command: 'go.applications', shortcut: '⇧⌘A' },
        sep,
        { label: '프로젝트', command: 'go.projects' },
        { label: '수상', command: 'go.awards' },
      ],
    },
    windowMenu,
    help('finder'),
  ],
  portfolio: () => [
    appMenu('portfolio'),
    {
      title: '파일',
      items: [
        { label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' },
        sep,
        { label: '링크 복사', command: 'portfolio.copyLink' },
        { label: 'PDF 쪽으로 보기', command: 'portfolio.openPdf' },
        { label: '프린트…', command: 'portfolio.print', shortcut: '⌘P' },
      ],
    },
    edit,
    { title: '보기', items: [{ label: '목차 가리기', command: 'portfolio.toggleSidebar', shortcut: '⌃⌘S' }, sep, viewFullScreen] },
    {
      title: '이동',
      items: [
        { label: '이전 프로젝트', command: 'portfolio.previous', shortcut: '⌘[' },
        { label: '다음 프로젝트', command: 'portfolio.next', shortcut: '⌘]' },
      ],
    },
    windowMenu,
    help('portfolio'),
  ],
  about: () => [appMenu('about'), { title: '파일', items: [{ label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' }] }, edit, windowMenu, help('about')],
  messages: () => [
    appMenu('messages'),
    { title: '파일', items: [{ label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' }] },
    edit,
    { title: '보기', items: [viewFullScreen] },
    { title: '대화', items: [{ label: '대화 처음부터', command: 'messages.restart' }] },
    windowMenu,
    help('messages'),
  ],
  mail: () => [
    appMenu('mail'),
    { title: '파일', items: [{ label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' }] },
    edit,
    { title: '메시지', items: [{ label: '보내기', command: 'mail.send', shortcut: '⇧⌘D' }] },
    windowMenu,
    help('mail'),
  ],
  photos: () => [appMenu('photos'), { title: '파일', items: [{ label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' }] }, edit, { title: '보기', items: [viewFullScreen] }, windowMenu, help('photos')],
  notes: () => [appMenu('notes'), { title: '파일', items: [{ label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' }] }, edit, { title: '보기', items: [viewFullScreen] }, windowMenu, help('notes')],
  safari: () => [
    appMenu('safari'),
    {
      title: '파일',
      items: [
        { label: '위치 열기…', command: 'safari.openLocation', shortcut: '⌘L' },
        { label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' },
      ],
    },
    edit,
    { title: '보기', items: [{ label: '페이지 다시 로드', command: 'safari.reload', shortcut: '⌘R' }, sep, viewFullScreen] },
    {
      title: '방문 기록',
      items: [
        { label: '뒤로', command: 'nav.back', shortcut: '⌘[' },
        { label: '앞으로', command: 'nav.forward', shortcut: '⌘]' },
        { label: '홈', command: 'safari.home', shortcut: '⇧⌘H' },
      ],
    },
    { title: '책갈피', items: [{ label: '즐겨찾기 보기', command: 'safari.home' }] },
    windowMenu,
    help('safari'),
  ],
  github: () => [appMenu('github'), { title: '파일', items: [{ label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' }] }, edit, windowMenu, help('github')],
  blog: () => [appMenu('blog'), { title: '파일', items: [{ label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' }] }, edit, { title: '보기', items: [{ label: '페이지 다시 로드', command: 'safari.reload', shortcut: '⌘R' }] }, windowMenu, help('blog')],
  terminal: () => [
    appMenu('terminal'),
    {
      title: '셸',
      items: [
        { label: '새로운 윈도우', command: 'terminal.new', shortcut: '⌘N' },
        { label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' },
      ],
    },
    { ...edit, items: [...edit.items, sep, { label: '버퍼 지우기', command: 'terminal.clear', shortcut: '⌘K' }] },
    { title: '보기', items: [viewFullScreen] },
    windowMenu,
    help('terminal'),
  ],
  preview: () => [
    appMenu('preview'),
    {
      title: '파일',
      items: [
        { label: '윈도우 닫기', command: 'window.close', shortcut: '⌘W' },
        sep,
        { label: 'PDF 내려받기', command: 'preview.download', shortcut: '⌘S' },
        { label: '프린트…', command: 'preview.print', shortcut: '⌘P' },
      ],
    },
    edit,
    {
      title: '보기',
      items: [
        // No key equivalents: ⌘0 ⌘+ ⌘− stay the browser's page zoom, which low-vision visitors rely on.
        { label: '실제 크기', command: 'preview.actualSize' },
        { label: '확대', command: 'preview.zoomIn' },
        { label: '축소', command: 'preview.zoomOut' },
        sep,
        viewFullScreen,
      ],
    },
    {
      title: '이동',
      items: [
        { label: '이전 페이지', command: 'preview.previous', shortcut: '⌥⌘↑' },
        { label: '다음 페이지', command: 'preview.next', shortcut: '⌥⌘↓' },
      ],
    },
    windowMenu,
    help('preview'),
  ],
  // System Settings has no 파일 menu; its 윈도우 menu starts with 닫기 (⌘W).
  settings: () => [
    appMenu('settings', [], true),
    edit,
    { title: '보기', items: [{ label: '검색', command: 'edit.find', shortcut: '⌘F' }] },
    { ...windowMenu, items: [{ label: '닫기', command: 'window.close', shortcut: '⌘W' }, ...windowMenu.items] },
    help('settings'),
  ],
};

export const menusFor = (app: AppId): Menu[] => MENUS[app]();

/** Every enabled item with a shortcut, for the keyboard handler. */
export function keyEquivalents(menus: Menu[]): { shortcut: string; command: string; menuTitle: string }[] {
  const out: { shortcut: string; command: string; menuTitle: string }[] = [];
  const walk = (entries: MenuEntry[], menuTitle: string) => {
    for (const entry of entries) {
      if (entry === 'separator') continue;
      if (entry.shortcut && entry.command) out.push({ shortcut: entry.shortcut, command: entry.command, menuTitle });
      if (entry.submenu) walk(entry.submenu, menuTitle);
    }
  };
  for (const menu of menus) walk(menu.items, menu.title);
  return out;
}
