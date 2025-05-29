import React from "react";
import { useRecoilState } from "recoil";
import { taskbarState } from "../../Atoms";
import * as styles from "./Taskbar.css";

interface TaskbarProps {
  setActiveItem: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ setActiveItem }) => {
  const [taskbarItems] = useRecoilState(taskbarState);

  return (
    <styles.TaskbarContainer>
      {taskbarItems.taskbars.map((item) => (
        <styles.TaskbarItem
          key={item.id}
          isActive={taskbarItems.activeTaskbar === item.id}
          onClick={() => setActiveItem(item.id)}
        >
          <styles.Icon src={item.imageUrl} alt={item.id} />
        </styles.TaskbarItem>
      ))}
    </styles.TaskbarContainer>
  );
};

export default Taskbar;
