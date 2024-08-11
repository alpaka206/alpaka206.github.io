import React, { useEffect, useRef, useState } from "react";
import * as styles from "./FolderPageContainer.css";
import { useRecoilState } from "recoil";
import { tabsState } from "../../Atoms";
import FolderContainer from "../FolderContainer/FolderContainer";

interface FolderPageContainerProps {
  onClose: () => void;
  style?: React.CSSProperties;
  setPageZIndex: (index: number) => void;
  setFolderZIndex: (index: number) => void;
  bringFolderToFront: () => void;
  setActiveTab: (index: number) => void;
}

const FolderPageContainer: React.FC<FolderPageContainerProps> = ({
  onClose,
  style,
  setPageZIndex,
  setFolderZIndex,
  bringFolderToFront,
  setActiveTab,
}) => {
  const [tabs, setTabs] = useRecoilState(tabsState);
  const [position, setPosition] = useState({ x: 50, y: 50 });

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

  const handlePageOpen = (
    title: string,
    imageUrl: string,
    content: React.ReactNode
  ) => {
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs, { title, imageUrl, content }];
      setActiveTab(newTabs.length - 1); // 새로 생성된 탭의 인덱스를 activeTab으로 설정
      return newTabs;
    });

    setPageZIndex(1000);
    setFolderZIndex(999);
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
      className={styles.folderPage}
      style={{ ...style, left: position.x, top: position.y }}
      onClick={() => bringFolderToFront()}
    >
      <div
        className={styles.windowHeader}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        프로젝트
        <img
          src="./assets/close.svg"
          alt="closeButton"
          onClick={onClose}
          className={styles.closeButton}
        />
      </div>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/Comatching.svg"
          title="COMATCHING"
          onClick={() =>
            handlePageOpen(
              "코매칭",
              "./assets/Comatching.svg",
              <iframe
                src="http://localhost:5173/Comatching"
                width="100%"
                height="90%"
                frameBorder="0"
                title="Comatching"
              ></iframe>
            )
          }
        />
        <FolderContainer
          imageUrl="./assets/Shareit.svg"
          title="Shareit"
          onClick={() =>
            handlePageOpen(
              "Shareit",
              "./assets/Shareit.svg",
              <iframe
                src="http://localhost:5173/ShareIt"
                width="100%"
                height="90%"
                frameBorder="0"
                title="Shareit"
              ></iframe>
            )
          }
        />
        <FolderContainer
          imageUrl="./assets/ALNC.svg"
          title="새차처럼"
          onClick={() =>
            handlePageOpen(
              "새차처럼",
              "./assets/ALNC.svg",
              <iframe
                src="http://localhost:5173/ALNC"
                width="100%"
                height="90%"
                frameBorder="0"
                title="ALNC"
              ></iframe>
            )
          }
        />
      </div>
    </div>
  );
};

export default FolderPageContainer;
