import React, { useState, useRef, useEffect } from "react";
import * as styles from "./PageContainer.css";
import { useRecoilState } from "recoil";
import { tabsState, taskbarState } from "../../Atoms";

export interface PageContainerProps {
  onClose: () => void;
  style?: React.CSSProperties;
  bringPageToFront: () => void;
}

const PageContainer: React.FC<PageContainerProps> = ({
  onClose,
  style,
  bringPageToFront,
}) => {
  // const [activeTab, setActiveTab] = useState<number>(0);
  const [tabs, setTabs] = useRecoilState(tabsState);
  const [taskbar, setTaskbar] = useRecoilState(taskbarState);

  const [position, setPosition] = useState({ x: 200, y: 50 });
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
    setTabs((prevTabs) => ({
      ...prevTabs,
      activeTabIndex: index,
    }));
    setTaskbar((prevTaskbar) => ({
      ...prevTaskbar,
      activeTaskbar: tabs.tabs[index].title,
    }));
  };

  const handleTabClose = (index: number) => {
    const updatedTabs = tabs.tabs.filter((_, i) => i !== index);
    const newActiveTabIndex =
      tabs.activeTabIndex === index && updatedTabs.length > 0
        ? 0
        : tabs.activeTabIndex === index
          ? null
          : tabs.activeTabIndex && tabs.activeTabIndex > index
            ? tabs.activeTabIndex - 1
            : tabs.activeTabIndex;

    setTabs({
      tabs: updatedTabs,
      activeTabIndex: newActiveTabIndex,
    });

    const updatedTaskbars = taskbar.taskbars.filter(
      (taskbarItem) => taskbarItem.id !== tabs.tabs[index].title
    );
    setTaskbar({
      taskbars: updatedTaskbars,
      activeTaskbar: updatedTaskbars.length > 0 ? updatedTaskbars[0].id : null,
    });

    // 모든 탭이 닫힌 경우 onClose 호출
    if (updatedTabs.length === 0) {
      onClose();
    }
  };

  return (
    <div
      className={styles.window}
      style={{ ...style, left: position.x, top: position.y }}
      onClick={() => bringPageToFront()}
    >
      <div
        className={styles.windowHeader}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className={styles.tabs}>
          {tabs.tabs.map((tab, index) => (
            <React.Fragment key={index}>
              {tabs.activeTabIndex === index ? (
                <div className={styles.TabSide}>
                  <div className={styles.leftTabSideElement} />
                </div>
              ) : (
                ""
              )}
              <button
                key={index}
                className={`${styles.tabButton} ${
                  tabs.activeTabIndex === index
                    ? styles.activeTab
                    : styles.unactiveTab
                }`}
                onClick={() => handleTabClick(index)}
              >
                <img
                  src={tab.imageUrl}
                  alt={tab.title}
                  className={styles.tabButtonImage}
                />
                {tab.title}
                <img
                  src="./assets/close.svg"
                  alt={tab.title}
                  className={styles.closeTabButton}
                  onClick={() => handleTabClose(index)}
                />
              </button>
              {tabs.activeTabIndex === index ? (
                <div className={styles.TabSide}>
                  <div className={styles.rightTabSideElement} />
                </div>
              ) : (
                ""
              )}
            </React.Fragment>
          ))}
        </div>
        <img
          src="./assets/close.svg"
          alt="closeButton"
          onClick={onClose}
          className={styles.closeButton}
        />
      </div>
      <div className={styles.windowBody}>
        {tabs.tabs[tabs.activeTabIndex || 0]?.content}
      </div>
    </div>
  );
};

export default PageContainer;
