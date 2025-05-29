import * as styles from "./PhoneFolderPage.css";
import FolderContainer from "../FolderContainer/FolderContainer";
import { useNavigate } from "react-router-dom";

interface FolderPageContainerProps {
  onClose: () => void;
}

const FolderPageContainer: React.FC<FolderPageContainerProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // e.target이 모달의 배경일 때만 닫히도록 설정
    if ((e.target as HTMLElement).classList.contains(styles.FolderPage)) {
      onClose();
    }
  };
  return (
    <styles.FolderPage onClick={handleBackgroundClick}>
      <styles.PhoneFolderText>프로젝트</styles.PhoneFolderText>
      <styles.PhoneFolderContainer>
        <FolderContainer
          imageUrl="./assets/Comatching.svg"
          title="코매칭"
          onClick={() => navigate("/COMATCHING")}
        />
        <FolderContainer
          imageUrl="./assets/Shareit.svg"
          title="Shareit"
          onClick={() => navigate("/ShareIt")}
        />
        <FolderContainer
          imageUrl="./assets/ALNC.svg"
          title="새차처럼"
          onClick={() => navigate("/ALNC")}
        />
      </styles.PhoneFolderContainer>
    </styles.FolderPage>
  );
};

export default FolderPageContainer;
