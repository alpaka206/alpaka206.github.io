import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Mainpage.tsx
import { useState } from "react";
import * as styles from "../css/Mainpage.css";
// import { useNavigate } from "react-router-dom";
import FolderContainer from "../components/FolderContainer/FolderContainer";
import PageContainer from "../components/PageContainer/PageContainer";
const Mainpage = () => {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const handleFolderClick = (title) => {
        setSelectedFolder(title);
    };
    const handleClose = () => {
        setSelectedFolder(null);
    };
    const renderContent = () => {
        switch (selectedFolder) {
            case "프로필":
                return _jsx("div", { children: "\uD504\uB85C\uD544 \uB0B4\uC6A9" });
            case "프로젝트":
                return _jsx("div", { children: "\uD504\uB85C\uC81D\uD2B8 \uB0B4\uC6A9" });
            case "블로그":
                return _jsx("div", { children: "\uBE14\uB85C\uADF8 \uB0B4\uC6A9" });
            case "인스타":
                return _jsx("div", { children: "\uC778\uC2A4\uD0C0 \uB0B4\uC6A9" });
            case "수상내역":
                return _jsx("div", { children: "\uC218\uC0C1\uB0B4\uC5ED \uB0B4\uC6A9" });
            case "깃허브":
                return (_jsx("iframe", { src: "https://github.com/alpaka206", style: { width: "100%", height: "100%", border: "none" }, title: "GitHub" }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.folderContainer, children: [_jsx(FolderContainer, { imageUrl: "./assets/AboutMe.png", title: "\uD504\uB85C\uD544", onClick: () => handleFolderClick("프로필") }), _jsx(FolderContainer, { imageUrl: "./assets/Folder.png", title: "\uD504\uB85C\uC81D\uD2B8", onClick: () => handleFolderClick("프로젝트") }), _jsx(FolderContainer, { imageUrl: "./assets/Blog.png", title: "\uBE14\uB85C\uADF8", onClick: () => handleFolderClick("블로그") })] }), _jsxs("div", { className: styles.folderContainer, children: [_jsx(FolderContainer, { imageUrl: "./assets/Insta.png", title: "\uC778\uC2A4\uD0C0", onClick: () => handleFolderClick("인스타") }), _jsx(FolderContainer, { imageUrl: "./assets/prize.png", title: "\uC218\uC0C1\uB0B4\uC5ED", onClick: () => handleFolderClick("수상내역") }), _jsx(FolderContainer, { imageUrl: "./assets/Github.png", title: "\uAE43\uD5C8\uBE0C", onClick: () => handleFolderClick("깃허브") })] }), selectedFolder && (_jsx(PageContainer, { title: selectedFolder, content: renderContent(), onClose: handleClose }))] }));
};
export default Mainpage;
