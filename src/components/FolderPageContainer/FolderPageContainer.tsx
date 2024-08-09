import React from "react";
import * as styles from "./FolderPageContainer.css";
import { useRecoilState } from "recoil";
import { tabsState } from "../../Atoms";

interface FolderPageContainerProps {
  folders: { title: string; content: React.ReactNode }[];
}

const FolderPageContainer: React.FC<FolderPageContainerProps> = ({
  folders,
}) => {
  const [tabs, setTabs] = useRecoilState(tabsState);

  const handleFolderClick = (title: string, content: React.ReactNode) => {
    setTabs((prevTabs) => [...prevTabs, { title, content }]);
  };

  return (
    <div className={styles.folderPageContainer}>
      {folders.map((folder, index) => (
        <div
          key={index}
          className={styles.folder}
          onClick={() => handleFolderClick(folder.title, folder.content)}
        >
          {folder.title}
        </div>
      ))}
    </div>
  );
};

export default FolderPageContainer;
