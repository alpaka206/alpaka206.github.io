// components/common/WindowHeader.tsx
import React, { useState } from "react";
import * as styles from "./WindowWrapper.css"; // 또는 WindowHeader.css

interface WindowHeaderProps {
  tabs: { title: string; imageUrl: string }[];
  activeTabIndex: number | null;
  onTabClick: (index: number) => void;
  onTabClose: (index: number) => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMinimize: () => void;
  bringFolderToFront: () => void;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
  tabs,
  activeTabIndex,
  onTabClick,
  onTabClose,
  onClose,
  onMouseDown,
  onMouseUp,
  bringFolderToFront,
  onMinimize,
}) => {
  const [isFullSize, setIsFullSize] = useState(false);
  return (
    <styles.WindowHeader onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <styles.Tabs>
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            {activeTabIndex === index && (
              <styles.TabSide onClick={() => onTabClick(index)}>
                <styles.LeftTabSideElement />
              </styles.TabSide>
            )}
            <styles.TabButton isActive={activeTabIndex === index}>
              <styles.TabButtonImage
                src={tab.imageUrl}
                alt={tab.title}
                onClick={() => onTabClick(index)}
              />
              <styles.TabTitle onClick={() => onTabClick(index)}>
                {tab.title}
              </styles.TabTitle>
              <styles.CloseTabButton
                src="./assets/icons/close.webp"
                alt={`닫기 ${tab.title}`}
                onClick={() => onTabClose(index)}
              />
            </styles.TabButton>
            {activeTabIndex === index && (
              <styles.TabSide onClick={() => onTabClick(index)}>
                <styles.RightTabSideElement />
              </styles.TabSide>
            )}
          </React.Fragment>
        ))}
      </styles.Tabs>
      <styles.ButtonGroup>
        <styles.WindowButton onClick={onMinimize}>
          <styles.IconButton src="/assets/icons/line.webp" alt="최소화" />
        </styles.WindowButton>
        <styles.WindowButton onClick={() => setIsFullSize((prev) => !prev)}>
          <styles.IconButton src="/assets/icons/square.webp" alt="확대" />
        </styles.WindowButton>
        <styles.WindowButton onClick={onClose}>
          <styles.IconButton src="/assets/icons/close.webp" alt="닫기" />
        </styles.WindowButton>
      </styles.ButtonGroup>
    </styles.WindowHeader>
  );
};

export default WindowHeader;
