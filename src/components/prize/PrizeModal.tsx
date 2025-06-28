import * as styles from "./styles/PrizeModal.css";

interface PrizeModalProps {
  imageSrc: string;
  onClose: () => void;
}

const PrizeModal = ({ imageSrc, onClose }: PrizeModalProps) => (
  <styles.Overlay onClick={onClose}>
    <styles.Modal>
      <styles.ModalImage src={imageSrc} alt="수상 이미지 확대" />
    </styles.Modal>
  </styles.Overlay>
);

export default PrizeModal;
