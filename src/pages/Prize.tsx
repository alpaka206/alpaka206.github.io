import { useState } from "react";
import * as styles from "../css/Prize.css";

const Prize = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const prizes = [
    {
      src: "./assets/prize/prize1.jpg",
      title: "우수상",
      date: "2023.11.28",
      description: "전공 설계, 취업 탐구 소모임 사업",
    },
    {
      src: "./assets/prize/prize2-1.jpg",
      title: "우수팀 선정",
      date: "2023.08.28",
      description: "하나 소셜벤처 유니버시티",
    },
    {
      src: "./assets/prize/prize2-2.jpg",
      title: "우수팀 선정",
      date: "2023.08.28",
      description: "하나 소셜벤처 유니버시티",
    },
    {
      src: "./assets/prize/prize3.jpg",
      title: "K-300",
      date: "2023.08.17",
      description: "창업유망팀 300 경진대회",
    },
    {
      src: "./assets/prize/prize4.jpg",
      title: "장려상",
      date: "2022.12.07",
      description: "전공 설계, 취업 탐구 소모임 사업",
    },
    {
      src: "./assets/prize/prize5.jpg",
      title: "최우수상",
      date: "2022.11.24",
      description: "정보통신전자공학부 학술동아리 발표대회",
    },
    {
      src: "./assets/prize/prize6.jpg",
      title: "동상",
      date: "2019.10.05",
      description: "ACM-ICPC 가톨릭대학교 교내 예선",
    },
    {
      src: "./assets/prize/prize7.jpg",
      title: "동상",
      date: "2019.10.05",
      description: "가톨릭대학교 Programming 대회 개인전",
    },
  ];

  return (
    <div className={styles.PrizePage}>
      <img
        src="./assets/back.svg"
        alt="Phone"
        className={styles.Back_button}
        onClick={() => window.history.back()}
      ></img>
      <div className={styles.PrizeContainer}>
        {prizes.map((prize, index) => (
          <div
            key={index}
            className={styles.PrizeElement}
            onClick={() => openModal(prize.src)}
          >
            <img src={prize.src} alt="prize" className={styles.PrizeImage} />
            <div className={styles.PrizeExplain}>
              <div>{prize.title}</div>
              <div>{prize.date}</div>
              <div>{prize.description}</div>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className={styles.ModalOverlay} onClick={closeModal}>
          <div className={styles.ModalContent}>
            <img
              src={selectedImage}
              alt="prize"
              className={styles.ModalImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Prize;
