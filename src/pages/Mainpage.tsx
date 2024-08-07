import React, { useState } from "react";
import * as styles from "../css/Mainpage.css";
import FolderContainer from "../components/FolderContainer/FolderContainer";
import PageContainer from "../components/PageContainer/PageContainer";
import FolderPageContainer from "../components/FolderPageContainer/FolderPageContainer";
import { useRecoilState } from "recoil";
import { tabsState } from "../Atoms";

const Mainpage: React.FC = () => {
  const [tabs, setTabs] = useRecoilState(tabsState);

  const handlePageOpen = (title: string, content: React.ReactNode) => {
    setTabs((prevTabs) => [...prevTabs, { title, content }]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/AboutMe.png"
          title="프로필"
          onClick={() =>
            setTabs((prevTabs) => [
              ...prevTabs,
              { title: "프로필", content: <div>프로필 내용</div> },
            ])
          }
        />
        <FolderContainer
          imageUrl="./assets/Folder.png"
          title="프로젝트"
          onClick={() =>
            setTabs((prevTabs) => [
              ...prevTabs,
              {
                title: "프로젝트",
                content: <FolderPageContainer folders={projectFolders} />,
              },
            ])
          }
        />
        <FolderContainer
          imageUrl="./assets/Blog.png"
          title="블로그"
          onClick={() =>
            setTabs((prevTabs) => [
              ...prevTabs,
              {
                title: "블로그",
                content: (
                  <iframe
                    src="https://alpaka206.vercel.app/"
                    width="100%"
                    height="90%"
                    frameBorder="0"
                    title="Blog"
                  ></iframe>
                ),
              },
            ])
          }
        />
      </div>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/Insta.png"
          title="인스타"
          onClick={() =>
            setTabs((prevTabs) => [
              ...prevTabs,
              {
                title: "인스타",
                content: (
                  <iframe
                    src="https://www.instagram.com/alpaka_dev/embed"
                    width="100%"
                    height="90%"
                    frameBorder="0"
                    title="Instagram"
                  ></iframe>
                ),
              },
            ])
          }
        />
        <FolderContainer
          imageUrl="./assets/prize.png"
          title="수상내역"
          onClick={() =>
            setTabs((prevTabs) => [
              ...prevTabs,
              { title: "수상내역", content: <div>수상내역 내용</div> },
            ])
          }
        />
        <FolderContainer
          imageUrl="./assets/Github.png"
          title="깃허브"
          onClick={() =>
            setTabs((prevTabs) => [
              ...prevTabs,
              {
                title: "깃허브",
                content: (
                  <iframe
                    src="http://localhost:5173/Github"
                    width="100%"
                    height="90%"
                    frameBorder="0"
                    title="GitHub"
                  ></iframe>
                ),
              },
            ])
          }
        />
      </div>
      {tabs.length > 0 && (
        <PageContainer tabs={tabs} onClose={() => setTabs([])} />
      )}
    </div>
  );
};

export default Mainpage;
