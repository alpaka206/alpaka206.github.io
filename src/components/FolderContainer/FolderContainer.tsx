import React from "react";
import * as styles from "./FolderContainer.css";

export interface FolderContainerProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
}

const FolderContainer: React.FC<FolderContainerProps> = ({
  imageUrl,
  title,
  onClick,
}) => (
  <div className={styles.containerStyle} onClick={onClick}>
    <div className={styles.imageContainerStyle}>
      <img src={imageUrl} alt={title} className={styles.imageStyle} />
    </div>
    <h3 className={styles.titleStyle}>{title}</h3>
  </div>
);

export default FolderContainer;
