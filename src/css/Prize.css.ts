import styled from "styled-components";

export const PrizePage = styled.div`
  padding: 20px 30px;
  background-color: #f9f9f9;
`;

export const BackButton = styled.img`
  display: none;
  @media (max-width: 768px) {
    display: block;
    background-color: #ffffff;
    width: 20px;
    height: 20px;
    padding: 10px;
    border-radius: 100px;
  }
`;

export const PrizeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

export const PrizeElement = styled.div`
  width: 300px;
  margin: 10px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

export const PrizeImage = styled.img`
  width: 120px;
  object-fit: cover;
  border: 1px solid #000;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  &:hover {
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    border: none;
  }
`;

export const PrizeExplain = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 232px;
  word-break: keep-all;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  width: 100%;
  height: auto;
  max-width: 450px;
  margin-top: -80px;
`;

export const ModalImage = styled.img`
  width: 100%;
  object-fit: contain;
`;
