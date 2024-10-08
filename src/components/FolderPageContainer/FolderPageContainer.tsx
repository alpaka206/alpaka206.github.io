import React, { useEffect, useRef, useState } from "react";
import * as styles from "./FolderPageContainer.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tabsState, taskbarState, ZIndexState } from "../../Atoms";
import FolderContainer from "../FolderContainer/FolderContainer";

interface FolderPageContainerProps {
  onClose: () => void;
  bringFolderToFront: () => void;
}

const FolderPageContainer: React.FC<FolderPageContainerProps> = ({
  onClose,
  bringFolderToFront,
}) => {
  const [tabs, setTabs] = useRecoilState(tabsState);
  const setTaskbar = useSetRecoilState(taskbarState);
  const [zIndexFolderState, setZIndexFolderState] = useRecoilState(ZIndexState);

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
    const existingTabIndex = tabs.tabs.findIndex((tab) => tab.title === title);
    if (existingTabIndex !== -1) {
      // 이미 같은 탭이 존재하면 해당 탭을 활성화
      setTabs((prevTabs) => ({
        ...prevTabs,
        activeTabIndex: existingTabIndex,
      }));
      setTaskbar((prevTaskbar) => ({
        ...prevTaskbar,
        activeTaskbar: title,
      }));
    } else {
      setTabs((prevTabs) => {
        const newTabs = [...prevTabs.tabs, { title, imageUrl, content }];
        return {
          tabs: newTabs,
          activeTabIndex: newTabs.length - 1, // 새로 생성된 탭의 인덱스를 activeTab으로 설정
        };
      });

      setTaskbar((prevTaskbar) => ({
        taskbars: [...prevTaskbar.taskbars, { id: title, imageUrl }],
        activeTaskbar: title,
      }));

      setZIndexFolderState({
        pageZIndex: 1000,
        folderZIndex: 999,
      });
    }
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
      style={{
        zIndex: zIndexFolderState.folderZIndex,
        left: position.x,
        top: position.y,
      }}
    >
      <div
        className={styles.windowHeader}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={() => {
          bringFolderToFront();
        }}
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
          title="코매칭"
          onClick={() => {
            handlePageOpen(
              "코매칭",
              "./assets/Comatching.svg",
              <iframe
                src="https://alpaka206.github.io/#/Comatching"
                // src="http://localhost:5173/#/Comatching"
                width="100%"
                height="80%"
                frameBorder="0"
                title="Comatching"
              ></iframe>
            );
          }}
        />
        <FolderContainer
          imageUrl="./assets/Shareit.svg"
          title="Shareit"
          onClick={() => {
            handlePageOpen(
              "Shareit",
              "./assets/Shareit.svg",
              <iframe
                src="https://alpaka206.github.io/#/ShareIt"
                // src="http://localhost:5173/#/ShareIt"
                width="100%"
                height="80%"
                frameBorder="0"
                title="Shareit"
              ></iframe>
            );
          }}
        />
        <FolderContainer
          imageUrl="./assets/ALNC.svg"
          title="새차처럼"
          onClick={() => {
            handlePageOpen(
              "새차처럼",
              "./assets/ALNC.svg",
              <iframe
                src="https://alpaka206.github.io/#/ALNC"
                // src="http://localhost:5173/#/ALNC"
                width="100%"
                height="80%"
                frameBorder="0"
                title="ALNC"
              ></iframe>
            );
          }}
        />
      </div>
    </div>
  );
};

export default FolderPageContainer;
