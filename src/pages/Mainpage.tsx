import React, { useState } from "react";
import * as styles from "../css/Mainpage.css";
import FolderContainer from "../components/FolderContainer/FolderContainer";
import PageContainer from "../components/PageContainer/PageContainer";
import FolderPageContainer from "../components/FolderPageContainer/FolderPageContainer";
import PhoneFolderPage from "../components/PhoneFolderPage/PhoneFolderPage";
import Taskbar from "../components/Taskbar/Taskbar";
import { useRecoilState } from "recoil";
import {
  tabsState,
  ZIndexState,
  taskbarState,
  isMobileState,
} from "../Atoms.tsx";
import { useNavigate } from "react-router-dom";

const Mainpage: React.FC = () => {
  const navigate = useNavigate();
  const [tabs, setTabs] = useRecoilState(tabsState);
  const [zIndexState, setZIndexState] = useRecoilState(ZIndexState);
  const [taskbar, setTaskbar] = useRecoilState(taskbarState);
  const [activeFolderPage, setActiveFolderPage] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useRecoilState(isMobileState);

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
  const handlePhonePageOpen = () => {
    setActiveFolderPage(true);
    window.history.pushState(null, "", window.location.href);
  };
  const handleFolderPageOpen = () => {
    setActiveFolderPage(true);
    bringFolderToFront();
    setTaskbar((prevTaskbar) => {
      if (!prevTaskbar.taskbars.some((item) => item.id === "folder")) {
        return {
          taskbars: [
            ...prevTaskbar.taskbars,
            { id: "folder", imageUrl: "./assets/folder.webp" },
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
      updatedTaskbars.length > 0 && tabs.activeTabIndex !== null
        ? updatedTaskbars[tabs.activeTabIndex].id
        : null;
    console.log(newActiveTaskbar);
    setTaskbar({
      taskbars: updatedTaskbars,
      activeTaskbar: newActiveTaskbar,
    });
  };

  const openGitHubPage = () => {
    const popupWidth = 1200;
    const popupHeight = 600;
    const popupX = Math.round(
      window.screenX + window.outerWidth / 2 - popupWidth / 2
    );
    const popupY = Math.round(
      window.screenY + window.outerHeight / 2 - popupHeight / 2
    );

    const featureWindow =
      "width=" +
      popupWidth +
      ", height=" +
      popupHeight +
      ", left=" +
      popupX +
      ", top=" +
      popupY;

    return window.open("https://github.com/alpaka206", "_blank", featureWindow);
  };

  return (
    <styles.Container>
      <styles.FolderGrid>
        <FolderContainer
          imageUrl="./assets/Profile.webp"
          title="About Me"
          onClick={() => {
            isMobile
              ? navigate("/Profile")
              : handlePageOpen(
                "About Me",
                "./assets/Profile.webp",
                <iframe
                  // src="https://alpaka206.github.io/#/Profile"
                  src="http://localhost:5173/#/Profile"
                  width="100%"
                  height="80%"
                  frameBorder="0"
                  title="About Me"
                ></iframe>
              );
          }}
        />
        <FolderContainer
          imageUrl={
            isMobile ? "./assets/phone/folder.png" : "./assets/folder.webp"
          }
          title="Projects"
          onClick={() =>
            isMobile ? handlePhonePageOpen() : handleFolderPageOpen()
          }
        />
        <FolderContainer
          imageUrl="./assets/Blog.png"
          title="Tech Blog"
          onClick={() =>
            isMobile
              ? (window.location.href = "https://alpaka206.vercel.app/")
              : handlePageOpen(
                "Tech Blog",
                "./assets/Blog.png",
                <iframe
                  src="https://alpaka206.vercel.app/"
                  width="100%"
                  height="80%"
                  frameBorder="0"
                  title="Tech Blog"
                ></iframe>
              )
          }
        />
        <FolderContainer
          imageUrl="./assets/Insta.webp"
          title="Instagram"
          onClick={() =>
            isMobile
              ? (window.location.href = "https://www.instagram.com/alpaka_dev/")
              : handlePageOpen(
                "Instagram",
                "./assets/Insta.webp",
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
          title="Awards"
          onClick={() =>
            isMobile
              ? navigate("/Prize")
              : handlePageOpen(
                "Awards",
                "./assets/prize.png",
                <iframe
                  // src="https://alpaka206.github.io/#/Prize"
                  src="http://localhost:5173/#/Prize"
                  width="100%"
                  height="90%"
                  frameBorder="0"
                  title="Awards"
                ></iframe>
              )
          }
        />
        <FolderContainer
          imageUrl={
            isMobile ? "./assets/phone/github.png" : "./assets/Github.png"
          }
          title="GitHub"
          onClick={() =>
            isMobile
              ? (window.location.href = "https://github.com/alpaka206")
              : openGitHubPage()
          }
        />
      </styles.FolderGrid>
      {!isMobile && tabs.tabs.length > 0 && (
        <PageContainer
          // tabs={tabs.tabs}
          // activeTab={tabs.activeTabIndex}
          onClose={() => handleCloseAllTabs()}
          // setActiveTab={(index) => setTabs({ ...tabs, activeTabIndex: index })}
          style={{ zIndex: zIndexState.pageZIndex }}
          bringPageToFront={bringPageToFront}
        />
      )}
      {activeFolderPage &&
        (isMobile ? (
          <PhoneFolderPage onClose={() => handleCloseFolderPage()} />
        ) : (
          <FolderPageContainer
            onClose={() => handleCloseFolderPage()}
            bringFolderToFront={bringFolderToFront}
          />
        ))}

      {!isMobile && <Taskbar setActiveItem={handleTaskbarItemClick} />}
    </styles.Container>
  );
};

export default Mainpage;
