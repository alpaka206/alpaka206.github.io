import { useMemo, useRef } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";
import type {
  AnyWindow,
  PagesWindow,
  FolderWindow,
  PageType,
} from "@/store/useDesktopStore";

/** 작업표시줄(간단 버전). 필요 시 분리해서 사용 */
function TaskbarInline() {
  const windows = useDesktopStore(s => s.windows);
  const activeWindowId = useDesktopStore(s => s.activeWindowId);
  const toggleTaskbarItem = useDesktopStore(s => s.toggleTaskbarItem);

  // ❷ 파생값은 컴포넌트에서 메모이즈
  const items = useMemo(() => {
    return windows
      .filter(w => w.isOpen || w.isMinimized)
      .slice() // sort 전에 복사 (원본 불변성 보장)
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(w => ({
        id: w.id,
        title: w.title,
        icon: w.icon,
        isActive: !w.isMinimized && w.id === activeWindowId,
      }));
  }, [windows, activeWindowId]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] h-12 backdrop-blur bg-black/30 border-t border-white/10 flex items-center px-2 gap-2">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => toggleTaskbarItem(it.id)}
          className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white/10 transition ${
            it.isActive ? "bg-white/15 outline outline-1 outline-white/25" : ""
          }`}
          title={it.title}
        >
          <img src={it.icon} alt="" className="w-5 h-5 rounded-sm" />
          <span className="text-sm text-white/90">{it.title}</span>
        </button>
      ))}
    </div>
  );
}

/** 개별 윈도우 프레임 */
function WindowShell({ win }: { win: AnyWindow }) {
  const {
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    setWindowPosition,
    setActiveTab,
    closeTab,
  } = useDesktopStore();

  const activeWindowId = useDesktopStore((s) => s.activeWindowId);

  // 드래그 핸들링
  const draggingRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const onPointerDownHeader = (e: React.PointerEvent) => {
    // 포커스
    focusWindow(win.id);
    // 드래그 시작
    (e.target as Element).setPointerCapture?.(e.pointerId);
    draggingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: win.position.x,
      originY: win.position.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || win.isMaximized) return;
    const { startX, startY, originX, originY } = draggingRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    setWindowPosition(win.id, { x: originX + dx, y: originY + dy });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  // 레이아웃 계산
  const stylePos = win.isMaximized
    ? {}
    : { left: win.position.x, top: win.position.y };
  const z = win.zIndex;

  return (
    <div
      className={`absolute ${win.isMaximized ? "inset-0" : ""} ${win.isOpen && !win.isMinimized ? "" : "hidden"}`}
      style={{ ...stylePos, zIndex: z, width: win.size?.w ?? 860, height: win.size?.h ?? 560 }}
    >
      {/* 창 프레임: #fefefe 배경, #888 테두리, radius 10px, 그림자 */}
      <div className="flex flex-col w-full h-full rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.3)] overflow-hidden border border-[#888] bg-[#fefefe]">
        {/* Title Bar: #dfdfdf 배경, 아래 보더 */}
        <div
          className={`flex items-center justify-between h-10 select-none cursor-grab active:cursor-grabbing bg-[#dfdfdf] border-b border-[#d0d0d0] px-3`}
          onPointerDown={onPointerDownHeader}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDoubleClick={() => maximizeWindow(win.id)}
        >
          <div className="flex items-center gap-2">
            <img src={win.icon} alt="" className="w-5 h-5 object-contain rounded-sm" />
            <span className="text-sm text-[#1f1f1f]">{win.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => minimizeWindow(win.id)} className="w-8 h-8 grid place-items-center hover:bg-black/5 rounded-md" title="Minimize">—</button>
            <button onClick={() => maximizeWindow(win.id)} className={`w-8 h-8 grid place-items-center hover:bg-black/5 rounded-md`} title="Maximize">□</button>
            <button onClick={() => closeWindow(win.id)} className="w-8 h-8 grid place-items-center hover:bg-red-500/20 rounded-md" title="Close">×</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden bg-white">
          {win.type === "pages" ? (
            <PagesBody win={win as PagesWindow} onSetActiveTab={setActiveTab} onCloseTab={closeTab} />
          ) : (
            <FolderBody win={win as FolderWindow} />
          )}
        </div>
      </div>
    </div>
  );
}

/** 페이지 창(탭 바 + 컨텐츠) */
function PagesBody({
  win,
  onSetActiveTab,
  onCloseTab,
}: {
  win: PagesWindow;
  onSetActiveTab: (id: PageType) => void;
  onCloseTab: (id: PageType) => void;
}) {
  const { tabs, activeTabId } = win;
  const active = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  );

 return (
    <div className="flex flex-col w-full h-full">
      {/* Tab bar: 높이 40px, 배경 #dfdfdf, 하단 보더 */}
      <div className="h-10 flex items-end bg-[#dfdfdf] border-b border-[#d0d0d0]">
        {/* 왼쪽 탭 사이드 흰색 바(6px), 오른쪽 둥근 모서리 */}
        <div className="w-[6px] h-full bg-white rounded-br-[8px]" />

        {/* 탭 버튼들 */}
        <div className="flex h-full">
          {tabs.map((t) => {
            const isActive = t.id === active?.id;
            return (
              <button
                key={t.id}
                onClick={() => onSetActiveTab(t.id)}
                className={[
                  "flex items-center justify-between w-[155px] rounded-t-[8px] text-[12px] font-normal select-none",
                  "pr-2 pl-0",
                  isActive
                    ? "bg-white pt-[6px] pb-[14px] mt-[6px] mb-0"
                    : "bg-[#dfdfdf] pt-[6px] pb-[6px] mt-[6px] mb-[8px] hover:bg-white/50",
                ].join(" ")}
                title={t.title}
              >
                <div className="flex items-center w-full">
                  <img src={t.icon} alt="" className="w-4 h-4 object-contain ml-2 mr-2" />
                  <span className="truncate text-[#1f1f1f]">{t.title}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onCloseTab(t.id); }}
                  className="ml-auto text-[#1f1f1f]/70 hover:text-[#1f1f1f]"
                  aria-label="Close tab"
                >
                  ×
                </button>
              </button>
            );
          })}
        </div>

        {/* 오른쪽 탭 사이드 회색 바(6px), 왼쪽 둥근 모서리 */}
        <div className="w-[6px] h-full bg-[#dfdfdf] rounded-bl-[8px]" />
      </div>

      {/* Content: 이미지/iframe 크기 보호 */}
      <div className="flex-1 h-[120%] overflow-y-auto p-0
                      [&_img]:max-w-full [&_img]:h-auto [&_img]:object-contain
                      [&_iframe]:w-full [&_iframe]:h-full">
        {active?.content ?? <div className="p-6 text-black/60 text-sm">No tab selected.</div>}
      </div>
    </div>
  );
}

/** 폴더 창 컨텐츠 */
function FolderBody({ win }: { win: FolderWindow }) {
  return <div className="w-full h-full overflow-auto">{win.content}</div>;
}

/** 데스크탑: 모든 윈도우 + 작업표시줄 */
export default function Desktop() {
  const windows = useDesktopStore((s) => s.windows);

  // zIndex 순으로 정렬
  const list = useMemo(
    () =>
      windows
        .filter((w) => w.isOpen && !w.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  );

  // 화면 전체 컨테이너 (포인터 이벤트 받도록)
  return (
    <>
      <div className="absolute inset-0">
        {list.map((w) => (
          <WindowShell key={w.id} win={w} />
        ))}
      </div>
      <TaskbarInline />
    </>
  );
}
