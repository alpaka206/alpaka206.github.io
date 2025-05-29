import styled from "styled-components";

export const Container = styled.div`
  padding: 5px;
  width: 86px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  @media screen and (max-width: 980px) {
    width: 80%;
  }
`;

export const ImageContainer = styled.div`
  width: 40px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Image = styled.img`
  width: 100%;
  height: auto;

  @media screen and (max-width: 980px) {
    border-radius: 40%;
  }
`;

export const Title = styled.h3`
  font-size: 12px;
  font-family: "Segoe UI Variable";
  font-weight: 400;
  color: #ffffff;

  @media screen and (max-width: 980px) {
    font-size: calc(8px + 2vw);
  }
`;
