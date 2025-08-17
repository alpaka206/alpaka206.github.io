import React from "react";
import * as styles from "./Taskbar.css";
import { useDesktopStore } from "../../store/useDesktopStore";

interface TaskbarProps {
  setActiveItem: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ setActiveItem }) => {
  const taskbarItems = useDesktopStore((state) => state.taskbarItems);
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const windows = useDesktopStore((state) => state.windows);

  return (
    <styles.TaskbarContainer>
      {taskbarItems.map((id) => {
        const win = windows.find((w) => w.id === id);
        if (!win) return null;

        return (
          <styles.TaskbarItem
            key={id}
            isActive={activeWindowId === id}
            onClick={() => setActiveItem(id)}
          >
            <styles.Icon src={win.icon} alt={win.title} />
          </styles.TaskbarItem>
        );
      })}
    </styles.TaskbarContainer>
  );
};

export default Taskbar;
