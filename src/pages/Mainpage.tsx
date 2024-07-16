import React, { useState } from "react";
import RotaionMain from "~/components/RotaionMain";
import * as styles from "../css/Mainpage.css.ts";
import { useNavigate } from "react-router-dom";

const Mainpage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEnterClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/NavPage");
    }, 1000); // 애니메이션 시간과 맞춰서 설정
  };

  return (
    <div
      className={`${styles.container} ${
        isAnimating ? styles.fadeOutAnimation : ""
      }`}
    >
      <div className={styles.header}>안녕하세요.</div>
      <div className={styles.subHeader}>프론트 개발자 김규원입니다.</div>
      <div className={styles.introText}>
        저의 공간에 오신 것을 환영합니다. 이곳에서 저의 기술과 프로젝트를
        탐험해보세요.
      </div>
      <div className={styles.enterButton} onClick={handleEnterClick}>
        입장하기
      </div>
      <RotaionMain />
    </div>
  );
};

export default Mainpage;
