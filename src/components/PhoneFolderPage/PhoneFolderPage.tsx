import React, { useEffect, useRef, useState } from "react";
import * as styles from "./PhoneFolderPage.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tabsState, taskbarState, ZIndexState } from "../../Atoms";
import FolderContainer from "../FolderContainer/FolderContainer";
import { useNavigate } from "react-router-dom";

interface FolderPageContainerProps {
  onClose: () => void;
}

const FolderPageContainer: React.FC<FolderPageContainerProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const handleBackgroundClick = (e) => {
    // e.target이 모달의 배경일 때만 닫히도록 설정
    if (e.target.classList.contains(styles.folderPage)) {
      onClose();
    }
  };
  return (
    <div className={styles.folderPage} onClick={handleBackgroundClick}>
      <div className={styles.phoneFolderText}>프로젝트</div>
      <div className={styles.phoneFolderContainer}>
        <FolderContainer
          imageUrl="./assets/Comatching.svg"
          title="코매칭"
          onClick={() => navigate("/COMATCHING")}
        />
        <FolderContainer
          imageUrl="./assets/Shareit.svg"
          title="Shareit"
          onClick={() => navigate("/ShareIt")}
        />
        <FolderContainer
          imageUrl="./assets/ALNC.svg"
          title="새차처럼"
          onClick={() => navigate("/ALNC")}
        />
      </div>
    </div>
  );
};

export default FolderPageContainer;
