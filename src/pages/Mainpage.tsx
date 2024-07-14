import React from "react";
import RotaionMain from "~/components/RotaionMain";
import * as styles from "../css/Mainpage.css.ts";

const Mainpage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>안녕하세요.</div>
      <div className={styles.subHeader}>프론트 개발자 김규원입니다.</div>
      <div className={styles.introText}>
        저의 공간에 오신 것을 환영합니다. 이곳에서 저의 기술과 프로젝트를
        탐험해보세요.
      </div>
      <RotaionMain />
    </div>
  );
};

export default Mainpage;
