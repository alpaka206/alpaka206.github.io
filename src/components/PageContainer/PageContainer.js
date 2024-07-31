import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as styles from "./PageContainer.css";
const PageContainer = ({ title, content, onClose, }) => {
    return (_jsx("div", { className: styles.modal, children: _jsxs("div", { className: styles.modalContent, children: [_jsxs("div", { className: styles.modalHeader, children: [_jsx("span", { className: styles.closeButton, onClick: onClose, children: "\u00D7" }), _jsx("h2", { children: title })] }), _jsx("div", { className: styles.modalBody, children: content })] }) }));
};
export default PageContainer;
