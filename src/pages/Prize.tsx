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
      src: "./assets/prize/prize1.webp",
      title: "우수상",
      date: "2023.11.28",
      description: "전공 설계, 취업 탐구 소모임 사업",
    },
    {
      src: "./assets/prize/prize2-1.webp",
      title: "우수팀 선정",
      date: "2023.08.28",
      description: "하나 소셜벤처 유니버시티",
    },
    {
      src: "./assets/prize/prize2-2.webp",
      title: "우수팀 선정",
      date: "2023.08.28",
      description: "하나 소셜벤처 유니버시티",
    },
    {
      src: "./assets/prize/prize3.webp",
      title: "K-300",
      date: "2023.08.17",
      description: "창업유망팀 300 경진대회",
    },
    {
      src: "./assets/prize/prize4.webp",
      title: "장려상",
      date: "2022.12.07",
      description: "전공 설계, 취업 탐구 소모임 사업",
    },
    {
      src: "./assets/prize/prize5.webp",
      title: "최우수상",
      date: "2022.11.24",
      description: "정보통신전자공학부 학술동아리 발표대회",
    },
    {
      src: "./assets/prize/prize6.webp",
      title: "동상",
      date: "2019.10.05",
      description: "ACM-ICPC 가톨릭대학교 교내 예선",
    },
    {
      src: "./assets/prize/prize7.webp",
      title: "동상",
      date: "2019.10.05",
      description: "가톨릭대학교 Programming 대회 개인전",
    },
  ];

  return (
    <styles.PrizePage>
      <styles.BackButton
        src="./assets/back.svg"
        alt="Phone"
        onClick={() => window.history.back()}
      />
      <styles.PrizeContainer>
        {prizes.map((prize, index) => (
          <styles.PrizeElement
            key={index}
            onClick={() => openModal(prize.src)}
          >
            <styles.PrizeImage src={prize.src} alt="prize" />
            <styles.PrizeExplain>
              <div>{prize.title}</div>
              <div>{prize.date}</div>
              <div>{prize.description}</div>
            </styles.PrizeExplain>
          </styles.PrizeElement>
        ))}
      </styles.PrizeContainer>
      {selectedImage && (
        <styles.ModalOverlay onClick={closeModal}>
          <styles.ModalContent>
            <styles.ModalImage
              src={selectedImage}
              alt="prize"
            />
          </styles.ModalContent>
        </styles.ModalOverlay>
      )}
    </styles.PrizePage>
  );
};

export default Prize;
