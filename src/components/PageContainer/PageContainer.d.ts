import React from "react";
interface PageContainerProps {
    title: string;
    content: React.ReactNode;
    onClose: () => void;
}
declare const PageContainer: React.FC<PageContainerProps>;
export default PageContainer;
