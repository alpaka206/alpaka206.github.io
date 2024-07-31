import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as styles from "./FolderContainer.css";
const FolderContainer = ({ imageUrl, title, onClick, }) => (_jsxs("div", { className: styles.containerStyle, onClick: onClick, children: [_jsx("div", { className: styles.imageContainerStyle, children: _jsx("img", { src: imageUrl, alt: title, className: styles.imageStyle }) }), _jsx("h3", { className: styles.titleStyle, children: title })] }));
export default FolderContainer;
