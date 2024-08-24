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
      updatedTabs.length > 0
        ? index >= updatedTabs.length - 1
          ? index - 1
          : index
        : null;

    setTabs({
      tabs: updatedTabs,
      activeTabIndex: newActiveTabIndex,
    });
    // 모든 탭이 닫힌 경우 onClose 호출
    if (newActiveTabIndex === null) {
      onClose();
    } else {
      const updatedTaskbars = taskbar.taskbars.filter(
        (taskbarItem) => taskbarItem.id !== tabs.tabs[index].title
      );

      console.log(updatedTaskbars);
      console.log(newActiveTabIndex);
      setTaskbar({
        taskbars: updatedTaskbars,
        activeTaskbar: updatedTabs[newActiveTabIndex].title,
      });
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
                <div
                  className={styles.TabSide}
                  onClick={() => handleTabClick(index)}
                >
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
              >
                <img
                  src={tab.imageUrl}
                  alt={tab.title}
                  className={styles.tabButtonImage}
                  onClick={() => handleTabClick(index)}
                />
                <div
                  className={styles.tabTitle}
                  onClick={() => handleTabClick(index)}
                >
                  {tab.title}
                </div>
                <img
                  src="./assets/close.svg"
                  alt={tab.title}
                  className={styles.closeTabButton}
                  onClick={() => handleTabClose(index)}
                />
              </button>
              {tabs.activeTabIndex === index ? (
                <div
                  className={styles.TabSide}
                  onClick={() => handleTabClick(index)}
                >
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
