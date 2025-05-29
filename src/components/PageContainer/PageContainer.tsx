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
    <styles.Window
      style={{ ...style, left: position.x, top: position.y }}
      onClick={() => bringPageToFront()}
    >
      <styles.WindowHeader
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <styles.Tabs>
          {tabs.tabs.map((tab, index) => (
            <React.Fragment key={index}>
              {tabs.activeTabIndex === index ? (
                <styles.TabSide
                  onClick={() => handleTabClick(index)}
                >
                  <styles.LeftTabSideElement />
                </styles.TabSide>
              ) : (
                ""
              )}
              <styles.TabButton
                key={index}
                isActive={tabs.activeTabIndex === index}
              >
                <styles.TabButtonImage
                  src={tab.imageUrl}
                  alt={tab.title}
                  onClick={() => handleTabClick(index)}
                />
                <styles.TabTitle
                  onClick={() => handleTabClick(index)}
                >
                  {tab.title}
                </styles.TabTitle>
                <styles.CloseTabButton
                  src="./assets/close.svg"
                  alt={tab.title}
                  onClick={() => handleTabClose(index)}
                />
              </styles.TabButton>
              {tabs.activeTabIndex === index ? (
                <styles.TabSide
                  onClick={() => handleTabClick(index)}
                >
                  <styles.RightTabSideElement />
                </styles.TabSide>
              ) : (
                ""
              )}
            </React.Fragment>
          ))}
        </styles.Tabs>
        <styles.CloseButton
          src="./assets/close.svg"
          alt="closeButton"
          onClick={onClose}
        />
      </styles.WindowHeader>
      <styles.WindowBody>
        {tabs.tabs[tabs.activeTabIndex || 0]?.content}
      </styles.WindowBody>
    </styles.Window>
  );
};

export default PageContainer;
