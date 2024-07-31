// Mainpage.tsx
import React, { useState } from "react";
import * as styles from "../css/Mainpage.css";
// import { useNavigate } from "react-router-dom";

import FolderContainer from "../components/FolderContainer/FolderContainer";
import PageContainer from "../components/PageContainer/PageContainer";

const Mainpage: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleFolderClick = (title: string) => {
    setSelectedFolder(title);
  };

  const handleClose = () => {
    setSelectedFolder(null);
  };

  const renderContent = () => {
    switch (selectedFolder) {
      case "프로필":
        return <div>프로필 내용</div>;
      case "프로젝트":
        return <div>프로젝트 내용</div>;
      case "블로그":
        return <div>블로그 내용</div>;
      case "인스타":
        return <div>인스타 내용</div>;
      case "수상내역":
        return <div>수상내역 내용</div>;
      case "깃허브":
        return (
          <iframe
            src="https://github.com/alpaka206"
            style={{ width: "100%", height: "100%", border: "none" }}
            title="GitHub"
          ></iframe>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/AboutMe.png"
          title="프로필"
          onClick={() => handleFolderClick("프로필")}
        />
        <FolderContainer
          imageUrl="./assets/Folder.png"
          title="프로젝트"
          onClick={() => handleFolderClick("프로젝트")}
        />
        <FolderContainer
          imageUrl="./assets/Blog.png"
          title="블로그"
          onClick={() => handleFolderClick("블로그")}
        />
      </div>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/Insta.png"
          title="인스타"
          onClick={() => handleFolderClick("인스타")}
        />
        <FolderContainer
          imageUrl="./assets/prize.png"
          title="수상내역"
          onClick={() => handleFolderClick("수상내역")}
        />
        <FolderContainer
          imageUrl="./assets/Github.png"
          title="깃허브"
          onClick={() => handleFolderClick("깃허브")}
        />
      </div>
      {selectedFolder && (
        <PageContainer
          title={selectedFolder}
          content={renderContent()}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default Mainpage;
