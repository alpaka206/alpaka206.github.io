import React, { useState, useRef, useEffect } from "react";
import * as styles from "./PageContainer.css";
import WindowHeader from "../common/WindowWrapper/WindowWrapper";
import { useDesktopStore } from "../../store/useDesktopStore";

export interface PageContainerProps {
  onClose: () => void;
  style?: React.CSSProperties;
  bringPageToFront: () => void;
  onMinimize: () => void;
}

const PageContainer: React.FC<PageContainerProps> = ({
  onClose,
  style,
  bringPageToFront,
  onMinimize,
}) => {
  const { windows, activeWindowId, focusWindow, closeWindow, taskbarItems } =
    useDesktopStore();
  const tabs = windows.filter((w) => w.type === "project" && w.isOpen);
  const activeTabIndex = tabs.findIndex((w) => w.id === activeWindowId);

  const [position, setPosition] = useState({ x: 200, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleTabClick = (index: number) => {
    const tabId = tabs[index].id;
    focusWindow(tabId);
  };

  const handleTabClose = (index: number) => {
    const closedTab = tabs[index];
    closeWindow(closedTab.id);
    if (tabs.length === 1) onClose();
  };

  return (
    <styles.Window
      style={{ ...style, left: position.x, top: position.y }}
      onClick={() => bringPageToFront()}
    >
      <WindowHeader
        tabs={tabs.map(({ title, icon }) => ({
          title,
          imageUrl: icon, // icon 필드를 imageUrl로 매핑
        }))}
        activeTabIndex={activeTabIndex}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onClose={onClose}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        bringFolderToFront={bringPageToFront}
        onMinimize={onMinimize}
      />
      <styles.WindowBody>{tabs[activeTabIndex]?.content}</styles.WindowBody>
    </styles.Window>
  );
};

export default PageContainer;
