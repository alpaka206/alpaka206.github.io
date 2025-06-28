import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  max-width: 450px;
  width: 100%;
  margin-top: -80px;
`;

export const ModalImage = styled.img`
  width: 100%;
  object-fit: contain;
`;
