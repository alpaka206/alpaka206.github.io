import * as styles from "../css/Prize.css";

const Prize = () => {
  return (
    <div className={styles.PrizePage}>
      Prize
      <div className={styles.PrizeContainer}>
        <div className={styles.PrizeElement}>
          <img
            src="./assets/prize/prize1.jpg"
            alt="prize"
            className={styles.PrizeImage}
          />
          <div>설명</div>
        </div>
        <div className={styles.PrizeElement}>
          <img
            src="./assets/prize/prize2-1.jpg"
            alt="prize"
            className={styles.PrizeImage}
          />
          <div>설명</div>
        </div>
        <div className={styles.PrizeElement}>
          <img
            src="./assets/prize/prize2-2.jpg"
            alt="prize"
            className={styles.PrizeImage}
          />
          <div>설명</div>
        </div>
        <div className={styles.PrizeElement}>
          <img
            src="./assets/prize/prize3.jpg"
            alt="prize"
            className={styles.PrizeImage}
          />
          <div>설명</div>
        </div>
        <div className={styles.PrizeElement}>
          <img
            src="./assets/prize/prize4.jpg"
            alt="prize"
            className={styles.PrizeImage}
          />
          <div>설명</div>
        </div>
        <div className={styles.PrizeElement}>
          <img
            src="./assets/prize/prize5.jpg"
            alt="prize"
            className={styles.PrizeImage}
          />
          <div>설명</div>
        </div>
        <div className={styles.PrizeElement}>
          <img
            src="./assets/prize/prize6.jpg"
            alt="prize"
            className={styles.PrizeImage}
          />
          <div>설명</div>
        </div>
        <div className={styles.PrizeElement}>
          <img
            src="./assets/prize/prize7.jpg"
            alt="prize"
            className={styles.PrizeImage}
          />
          <div>설명</div>
        </div>
      </div>
    </div>
  );
};

export default Prize;
