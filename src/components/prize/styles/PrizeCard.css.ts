import { styled } from "styled-components";

export const card = styled.div`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const thumbnailWrapper = styled.div`
  width: 100%;
  height: 200px;
  padding: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f4f6;
`;

export const thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

export const textBox = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: calc(100% - 32px);
`;

export const title = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #101010;
`;

export const date = styled.div`
  font-size: 0.875rem;
  color: #888;
`;

export const description = styled.div`
  font-size: 0.95rem;
  color: #444;
`;
