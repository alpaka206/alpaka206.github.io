import React from "react";
import * as styles from "./PageContainer.css";

interface PageContainerProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  content,
  onClose,
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.closeButton} onClick={onClose}>
            &times;
          </span>
          <h2>{title}</h2>
        </div>
        <div className={styles.modalBody}>{content}</div>
      </div>
    </div>
  );
};

export default PageContainer;
