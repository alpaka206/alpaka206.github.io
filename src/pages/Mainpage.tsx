import React, { useState } from "react";
import * as styles from "../css/Mainpage.css";
import FolderContainer from "../components/FolderContainer/FolderContainer";
import PageContainer from "../components/PageContainer/PageContainer";
import FolderPageContainer from "../components/FolderPageContainer/FolderPageContainer";
import Taskbar from "../components/Taskbar/Taskbar";
import { useRecoilState } from "recoil";
import { tabsState, ZIndexState, taskbarState } from "../Atoms.tsx";

const Mainpage: React.FC = () => {
  const [tabs, setTabs] = useRecoilState(tabsState);
  const [zIndexState, setZIndexState] = useRecoilState(ZIndexState);
  const [taskbar, setTaskbar] = useRecoilState(taskbarState);
  const [activeFolderPage, setActiveFolderPage] = useState<boolean>(false);

  const handlePageOpen = (
    title: string,
    imageUrl: string,
    content: React.ReactNode
  ) => {
    const existingTabIndex = tabs.tabs.findIndex((tab) => tab.title === title);
    if (existingTabIndex !== -1) {
      setTabs((prevTabs) => ({
        ...prevTabs,
        activeTabIndex: existingTabIndex, // 같은 탭이 존재하면 해당 탭을 활성화
      }));
      setTaskbar((prevTaskbar) => ({
        ...prevTaskbar,
        activeTaskbar: title, // 활성화된 Taskbar 업데이트
      }));
    } else {
      setTabs((prevTabs) => {
        const newTabs = [...prevTabs.tabs, { title, imageUrl, content }];
        return {
          tabs: [...prevTabs.tabs, { title, imageUrl, content }],
          activeTabIndex: newTabs.length - 1, // 새로 생성된 탭의 인덱스를 activeTab으로 설정
        };
      });
      setTaskbar((prevTaskbar) => ({
        taskbars: [...prevTaskbar.taskbars, { id: title, imageUrl }],
        activeTaskbar: title, // 활성화된 Taskbar 업데이트
      }));
    }

    bringPageToFront();
  };

  const handleFolderPageOpen = () => {
    setActiveFolderPage(true);
    bringFolderToFront();
    setTaskbar((prevTaskbar) => {
      if (!prevTaskbar.taskbars.some((item) => item.id === "folder")) {
        return {
          taskbars: [
            ...prevTaskbar.taskbars,
            { id: "folder", imageUrl: "./assets/Folder.png" },
          ],
          activeTaskbar: "folder", // 폴더를 활성화된 Taskbar로 설정
        };
      } else {
        // taskbars 배열에 "folder"가 이미 있는 경우, activeTaskbar만 업데이트
        return {
          ...prevTaskbar,
          activeTaskbar: "folder",
        };
      }
    });
  };

  const bringPageToFront = () => {
    setZIndexState({
      pageZIndex: 1000,
      folderZIndex: 999,
    });
    console.log(taskbar);
  };

  const bringFolderToFront = () => {
    setZIndexState({
      pageZIndex: 999,
      folderZIndex: 1000,
    });
    setTaskbar((prevTaskbar) => {
      // taskbars 배열에 "folder"가 있는지 확인
      const folderExists = prevTaskbar.taskbars.some(
        (taskbarItem) => taskbarItem.id === "folder"
      );

      // "folder"가 존재하면 activeTaskbar를 "folder"로 설정
      if (folderExists) {
        return {
          ...prevTaskbar,
          activeTaskbar: "folder",
        };
      }

      // "folder"가 없으면 상태를 변경하지 않음
      return prevTaskbar;
    });
  };

  const handleTaskbarItemClick = (id: string) => {
    if (id === "folder") {
      setTaskbar((prevTaskbar) => ({
        ...prevTaskbar,
        activeTaskbar: "folder",
      }));
      bringFolderToFront();
    } else {
      const tabIndex = tabs.tabs.findIndex((tab) => tab.title === id);
      if (tabIndex !== -1) {
        setTabs((prevTabs) => ({
          ...prevTabs,
          activeTabIndex: tabIndex, // 해당 탭을 활성화
        }));
        setTaskbar((prevTaskbar) => ({
          ...prevTaskbar,
          activeTaskbar: id,
        }));
        bringPageToFront();
      }
    }
  };

  const handleCloseAllTabs = () => {
    const closedTabs = tabs.tabs; // 모든 탭 저장
    // 탭 초기화
    setTabs({
      tabs: [],
      activeTabIndex: null,
    });

    // taskbar에서 해당 탭 제거
    setTaskbar((prevTaskbar) => {
      const updatedTaskbars = prevTaskbar.taskbars.filter(
        (taskbarItem) => !closedTabs.some((tab) => tab.title === taskbarItem.id)
      );

      return {
        ...prevTaskbar,
        taskbars: updatedTaskbars,
        activeTaskbar:
          updatedTaskbars.length > 0
            ? updatedTaskbars[updatedTaskbars.length - 1].id
            : null,
      };
    });
  };

  const handleCloseFolderPage = () => {
    console.log(taskbar);
    console.log(tabs.activeTabIndex);
    setActiveFolderPage(false);
    const updatedTaskbars = taskbar.taskbars.filter(
      (taskbarItem) => taskbarItem.id !== "folder"
    );
    const newActiveTaskbar =
      updatedTaskbars.length > 0
        ? updatedTaskbars[tabs.activeTabIndex].id
        : null;
    console.log(newActiveTaskbar);
    setTaskbar({
      taskbars: updatedTaskbars,
      activeTaskbar: newActiveTaskbar,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.folderContainer}>
        <FolderContainer
          imageUrl="./assets/AboutMe.png"
          title="프로필"
          onClick={() => {
            handlePageOpen(
              "프로필",
              "./assets/AboutMe.png",
              <iframe
                // src="https://alpaka206.github.io/#/Profile"
                src="http://localhost:5173/#/Profile"
                width="100%"
                height="80%"
                frameBorder="0"
                title="Profile"
              ></iframe>
            );
          }}
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
                height="80%"
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
                // src="https://alpaka206.github.io/#/Prize"
                src="http://localhost:5173/#/Prize"
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
                // src="https://alpaka206.github.io/#/github"
                src="http://localhost:5173/#/github"
                width="100%"
                height="90%"
                frameBorder="0"
                title="GitHub"
              ></iframe>
            )
          }
        />
      </div>
      {tabs.tabs.length > 0 && (
        <PageContainer
          tabs={tabs.tabs}
          activeTab={tabs.activeTabIndex}
          onClose={() => handleCloseAllTabs()}
          setActiveTab={(index) => setTabs({ ...tabs, activeTabIndex: index })}
          style={{ zIndex: zIndexState.pageZIndex }}
          bringPageToFront={bringPageToFront}
        />
      )}
      {activeFolderPage && (
        <FolderPageContainer
          onClose={() => handleCloseFolderPage()}
          bringFolderToFront={bringFolderToFront}
        />
      )}
      <Taskbar setActiveItem={handleTaskbarItemClick} />
    </div>
  );
};

export default Mainpage;
