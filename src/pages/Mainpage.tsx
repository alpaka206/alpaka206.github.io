import React, { useState } from "react";
import * as styles from "../css/Mainpage.css";
import FolderContainer from "../components/FolderContainer/FolderContainer";
import PageContainer from "../components/PageContainer/PageContainer";
import FolderPageContainer from "../components/FolderPageContainer/FolderPageContainer";
import { useRecoilState } from "recoil";
import { tabsState, ZIndexState } from "../Atoms.tsx";

const Mainpage: React.FC = () => {
  const [tabs, setTabs] = useRecoilState(tabsState);
  const [zIndexState, setZIndexState] = useRecoilState(ZIndexState);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeFolderPage, setActiveFolderPage] = useState<boolean>(false);
  // const [pageZIndex, setPageZIndex] = useState<number>(1000);
  // const [folderZIndex, setFolderZIndex] = useState<number>(999);

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
    bringPageToFront();
  };

  const handleFolderPageOpen = () => {
    setActiveFolderPage(true);
    bringFolderToFront();
  };

  const bringPageToFront = () => {
    setZIndexState({
      pageZIndex: 1000,
      folderZIndex: 999,
    });
  };

  const bringFolderToFront = () => {
    setZIndexState({
      pageZIndex: 999,
      folderZIndex: 1000,
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/AboutMe.png"
          title="프로필"
          onClick={() =>
            handlePageOpen(
              "프로필",
              "./assets/AboutMe.png",
              <iframe
                src="https://alpaka206.github.io/Profile"
                width="100%"
                height="90%"
                frameBorder="0"
                title="Profile"
              ></iframe>
            )
          }
        />
        <FolderContainer
          imageUrl="./assets/Folder.png"
          title="프로젝트"
          onClick={() => handleFolderPageOpen()}
        />
        <FolderContainer
          imageUrl="./assets/Blog.png"
          title="블로그"
          onClick={() =>
            handlePageOpen(
              "블로그",
              "./assets/Blog.png",
              <iframe
                src="https://alpaka206.vercel.app/"
                width="100%"
                height="90%"
                frameBorder="0"
                title="Blog"
              ></iframe>
            )
          }
        />
      </div>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/Insta.png"
          title="인스타"
          onClick={() =>
            handlePageOpen(
              "인스타",
              "./assets/Insta.png",
              <iframe
                src="https://www.instagram.com/alpaka_dev/embed"
                width="100%"
                height="90%"
                frameBorder="0"
                title="Instagram"
              ></iframe>
            )
          }
        />
        <FolderContainer
          imageUrl="./assets/prize.png"
          title="수상내역"
          onClick={() =>
            handlePageOpen(
              "수상내역",
              "./assets/prize.png",
              <iframe
                src="https://alpaka206.github.io/Prize"
                width="100%"
                height="90%"
                frameBorder="0"
                title="Prize"
              ></iframe>
            )
          }
        />
        <FolderContainer
          imageUrl="./assets/Github.png"
          title="깃허브"
          onClick={() =>
            handlePageOpen(
              "깃허브",
              "./assets/Github.png",
              <iframe
                src="https://alpaka206.github.io/Github"
                width="100%"
                height="90%"
                frameBorder="0"
                title="GitHub"
              ></iframe>
            )
          }
        />
      </div>
      {tabs.length > 0 && (
        <PageContainer
          tabs={tabs}
          activeTab={activeTab}
          onClose={() => setTabs([])}
          setActiveTab={setActiveTab}
          style={{ zIndex: zIndexState.pageZIndex }}
          bringPageToFront={bringPageToFront}
        />
      )}
      {activeFolderPage && (
        <FolderPageContainer
          onClose={() => setActiveFolderPage(false)}
          setActiveTab={setActiveTab}
          style={{ zIndex: zIndexState.folderZIndex }}
          bringFolderToFront={bringFolderToFront}
        />
      )}
    </div>
  );
};

export default Mainpage;
