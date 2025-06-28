import * as styles from "./styles/PrizeCard.css";

interface PrizeCardProps {
  src: string;
  title: string;
  date: string;
  description: string;
  onClick: () => void;
}

const PrizeCard = ({
  src,
  title,
  date,
  description,
  onClick,
}: PrizeCardProps) => (
  <styles.card onClick={onClick}>
    <styles.thumbnailWrapper>
      <styles.thumbnail src={src} alt="수상 이미지" />
    </styles.thumbnailWrapper>
    <styles.textBox>
      <styles.title>{title}</styles.title>
      <styles.date>{date}</styles.date>
      <styles.description>{description}</styles.description>
    </styles.textBox>
  </styles.card>
);

export default PrizeCard;
