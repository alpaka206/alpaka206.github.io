// components/common/WindowHeader.tsx
import React from "react";
import * as styles from "./WindowWrapper.css"; // 또는 WindowHeader.css

interface WindowHeaderProps {
  tabs: { title: string; imageUrl: string }[];
  activeTabIndex: number | null;
  onTabClick: (index: number) => void;
  onTabClose: (index: number) => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
  tabs,
  activeTabIndex,
  onTabClick,
  onTabClose,
  onClose,
  onMouseDown,
  onMouseUp,
}) => {
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
      <styles.CloseButton
        src="./assets/icons/close.webp"
        alt="closeButton"
        onClick={onClose}
      />
    </styles.WindowHeader>
  );
};

export default WindowHeader;
