import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
  }

  body::-webkit-scrollbar {
    display: none;
  }

`;
