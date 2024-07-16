import React from "react";
import * as styles from "../css/Keyboard.css.ts";

const Keyboard: React.FC = () => {
  const fullKeys = [
    ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BACK"],
    ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "ENTER"],
    ["SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "SHIFT"],
    ["CTRL", "WIN", "ALT", "SPACE", "ENG", "ALT", "FN", "CTRL"],
  ];

  const smallKeys = [
    ["NO ESC", "23", "P", "O"],
    ["F", "L", "I", "O"],
    ["B", "A", "E", "Y"],
    ["U", "M", "I", "ENTER"],
  ];
  const longKeys = ["TAB", "BACK", "CAPS", "ENTER"];
  const isMobile = window.innerWidth <= 768;

  return (
    <div className={styles.keyboard}>
      {(isMobile ? smallKeys : fullKeys).map((row, rowIndex) => (
        <div key={rowIndex} className={styles.keyboardRow}>
          {row.map((key, keyIndex) => (
            <div
              key={keyIndex}
              className={`${styles.keyboardKey} ${
                longKeys.includes(key) ? styles.longKey : ""
              } ${key === "ENTER" ? styles.enterKey : ""} ${
                key === "SPACE" ? styles.spaceKey : ""
              } ${key === "SHIFT" ? styles.shiftKey : ""}`}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
