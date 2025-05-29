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
  <styles.Container onClick={onClick}>
    <styles.ImageContainer>
      <styles.Image src={imageUrl} alt={title} />
    </styles.ImageContainer>
    <styles.Title>{title}</styles.Title>
  </styles.Container>
);

export default FolderContainer;
