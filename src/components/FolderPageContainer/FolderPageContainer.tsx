import React, { useEffect, useRef, useState } from "react";
import * as styles from "./FolderPageContainer.css";
import FolderContainer from "../FolderContainer/FolderContainer";
import WindowHeader from "../common/WindowWrapper/WindowWrapper";
import { useDesktopStore } from "../../store/useDesktopStore";

interface FolderPageContainerProps {
  onClose: () => void;
  onMinimize: () => void;
  bringFolderToFront: () => void;
}

const FolderPageContainer: React.FC<FolderPageContainerProps> = ({
  onClose,
  bringFolderToFront,
  onMinimize,
}) => {
  const { openWindow, windows } = useDesktopStore();

  const [position, setPosition] = useState({ x: 150, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [isFullSize, setIsFullSize] = useState(false);

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

  const handlePageOpen = (
    id: string,
    title: string,
    icon: string,
    content: React.ReactNode
  ) => {
    openWindow({ id, type: "project", title, icon, content });
  };

  return (
    <styles.FolderPage
      style={{
        zIndex: Math.max(...windows.map((w) => w.zIndex)),
        left: isFullSize ? 0 : position.x,
        top: isFullSize ? 0 : position.y,
        width: isFullSize ? "100vw" : undefined,
        height: isFullSize ? "100vh" : undefined,
      }}
    >
      <WindowHeader
        tabs={[{ title: "Projects", imageUrl: "/assets/folder1.webp" }]}
        activeTabIndex={0}
        onTabClick={() => {}}
        onTabClose={onClose}
        onClose={onClose}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        bringFolderToFront={bringFolderToFront}
        onMinimize={onMinimize}
      />
      <styles.Body>
        <FolderContainer
          imageUrl="./assets/Comatching.webp"
          title="코매칭"
          onClick={() => {
            handlePageOpen(
              "comatching",
              "COMATCHING",
              "./assets/Comatching.webp",
              <iframe
                // src="https://alpaka206.github.io/#/Comatching"
                src="http://localhost:5173/#/Comatching"
                width="100%"
                height="80%"
                title="COMATCHING"
              ></iframe>
            );
          }}
        />
        <FolderContainer
          imageUrl="./assets/Shareit.webp"
          title="Share-It"
          onClick={() => {
            handlePageOpen(
              "share-it",
              "Share-It",
              "./assets/Shareit.webp",
              <iframe
                // src="https://alpaka206.github.io/#/ShareIt"
                src="http://localhost:5173/#/ShareIt"
                width="100%"
                height="80%"
                title="Shareit"
              ></iframe>
            );
          }}
        />
        <FolderContainer
          imageUrl="./assets/ALNC.webp"
          title="새차처럼"
          onClick={() => {
            handlePageOpen(
              "alnc",
              "새차처럼",
              "./assets/ALNC.webp",
              <iframe
                // src="https://alpaka206.github.io/#/ALNC"
                src="http://localhost:5173/#/ALNC"
                width="100%"
                height="80%"
                title="ALNC"
              ></iframe>
            );
          }}
        />
      </styles.Body>
    </styles.FolderPage>
  );
};

export default FolderPageContainer;
