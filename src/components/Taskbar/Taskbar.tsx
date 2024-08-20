import React from "react";
import { useRecoilState } from "recoil";
import { taskbarState } from "../../Atoms";
import * as styles from "./Taskbar.css";

interface TaskbarProps {
  activeItemId: string;
  setActiveItem: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ activeItemId, setActiveItem }) => {
  const [taskbarItems] = useRecoilState(taskbarState);

  return (
    <div className={styles.taskbar}>
      {taskbarItems.taskbars.map((item) => (
        <div
          key={item.id}
          className={`${styles.taskbarItem} ${
            activeItemId === item.id ? styles.active : ""
          }`}
          onClick={() => setActiveItem(item.id)}
        >
          <img src={item.imageUrl} alt={item.id} className={styles.icon} />
        </div>
      ))}
    </div>
  );
};

export default Taskbar;
