import React from "react";
export interface FolderContainerProps {
    imageUrl: string;
    title: string;
    onClick: () => void;
}
declare const FolderContainer: React.FC<FolderContainerProps>;
export default FolderContainer;
