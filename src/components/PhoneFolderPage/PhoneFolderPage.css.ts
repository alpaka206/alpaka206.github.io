import styled from "styled-components";

export const FolderPage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #828282;
  z-index: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PhoneFolderText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 25% 0;
  font-size: 36px;
  color: #fff;
  font-weight: bold;

  @media screen and (min-width: 970px) {
    font-size: 7em;
  }
`;

export const PhoneFolderContainer = styled.div`
  width: 84%;
  display: grid;
  background-color: #585858;
  grid-template-columns: repeat(4, 1fr);
  padding: 3%;
  border-radius: 8%;
  height: 44%;
  justify-items: center;
`;
