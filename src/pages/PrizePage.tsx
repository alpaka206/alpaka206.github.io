import { useState } from "react";
import PrizeCard from "../components/prize/PrizeCard";
import PrizeModal from "../components/prize/PrizeModal";
import { prizeList } from "../data/prizeData";
import * as styles from "../styles/PrizePage.css";

const PrizePage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <styles.Wrapper>
      <styles.BackButton
        src="./assets/back.svg"
        alt="뒤로가기"
        onClick={() => window.history.back()}
      />
      <styles.Grid>
        {prizeList.map((prize, idx) => (
          <PrizeCard
            key={idx}
            src={prize.src}
            title={prize.title}
            date={prize.date}
            description={prize.description}
            onClick={() => setSelectedImage(prize.src)}
          />
        ))}
      </styles.Grid>
      {selectedImage && (
        <PrizeModal
          imageSrc={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </styles.Wrapper>
  );
};

export default PrizePage;
