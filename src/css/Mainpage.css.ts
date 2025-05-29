import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a237e, #3949ab);

  @media screen and (min-width: 768px) {
    background-image: url("/assets/BGimage.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

export const FolderGrid = styled.div`
  @media (max-width: 768px) {
    padding: 20px 10px 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 20px;
    column-gap: 12px;
    justify-items: center;
  }
`;
