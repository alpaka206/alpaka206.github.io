import styled from "styled-components";

export const Container = styled.div`
  padding: 5px;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 6px;
  transition: background-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
  &:hover {
    background-color: #e4f1ff;
    box-shadow: 0 0 0 1px #c5d9f1 inset;
  }
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export const ImageContainer = styled.div`
  width: 50px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Image = styled.img<{ alt: String }>`
  width: 100%;
  height: auto;
  ${({ alt }) =>
    alt === "GitHub" &&
    `
    background-color: #ffffff;
    border-radius: 100%;
  `}
  ${({ alt }) =>
    alt === "Share-It" &&
    `
    border: 1px solid #000000;
    border-radius: 8px;

  `}
  @media (max-width: 768px) {
    border-radius: 40%;
  }
`;

export const Title = styled.h3`
  font-size: 12px;
  font-family: "Segoe UI Variable";
  font-weight: 400;
  color: #000000;
  @media (max-width: 768px) {
    font-size: calc(8px + 2vw);
  }
`;
