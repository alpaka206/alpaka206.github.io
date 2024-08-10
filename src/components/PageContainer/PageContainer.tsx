import React, { useState, useRef, useEffect } from "react";
import * as styles from "./PageContainer.css";
import { Tab } from "../../Atoms";

export interface PageContainerProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  onClose: () => void;
}

const PageContainer: React.FC<PageContainerProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  onClose,
}) => {
  // const [activeTab, setActiveTab] = useState<number>(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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

  return (
    <div
      className={styles.window}
      style={{ left: position.x, top: position.y }}
    >
      <div
        className={styles.windowHeader}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className={styles.tabs}>
          {tabs.map((tab, index) => (
            <>
              {activeTab === index ? (
                <div className={styles.TabSide}>
                  <div className={styles.leftTabSideElement} />
                </div>
              ) : (
                ""
              )}

              {/* <div className={` ${activeTab === index ? styles.TabSide : ""}`}>
                <div className={styles.leftTabSideElement} />
              </div> */}
              <button
                key={index}
                className={`${styles.tabButton} ${
                  activeTab === index ? styles.activeTab : styles.unactiveTab
                }`}
                onClick={() => setActiveTab(index)}
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
                />
              </button>
              {activeTab === index ? (
                <div className={styles.TabSide}>
                  <div className={styles.rightTabSideElement} />
                </div>
              ) : (
                ""
              )}
              {/* <div className={` ${activeTab === index ? styles.TabSide : ""}`}>
                <div className={styles.rightTabSideElement} />
              </div> */}
            </>
          ))}
        </div>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
      </div>
      <div className={styles.windowBody}>{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default PageContainer;
