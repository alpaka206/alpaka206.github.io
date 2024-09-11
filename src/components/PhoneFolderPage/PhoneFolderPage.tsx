import React, { useEffect, useRef, useState } from "react";
import * as styles from "./PhoneFolderPage.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tabsState, taskbarState, ZIndexState } from "../../Atoms";
import FolderContainer from "../FolderContainer/FolderContainer";

interface FolderPageContainerProps {
  onClose: () => void;
}

const FolderPageContainer: React.FC<FolderPageContainerProps> = ({
  onClose,
}) => {
  const handleBackgroundClick = (e) => {
    // e.target이 모달의 배경일 때만 닫히도록 설정
    if (e.target.classList.contains(styles.folderPage)) {
      onClose();
    }
  };
  return (
    <div className={styles.folderPage} onClick={handleBackgroundClick}>
      <div className={styles.windowHeader}>프로젝트</div>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/Comatching.svg"
          title="코매칭"
          onClick={() => {}}
        />
        <FolderContainer
          imageUrl="./assets/Shareit.svg"
          title="Shareit"
          onClick={() => {}}
        />
        <FolderContainer
          imageUrl="./assets/ALNC.svg"
          title="새차처럼"
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default FolderPageContainer;
