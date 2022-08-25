import { createGlobalStyle } from "styled-components";

import Harukaze from "../assets/fonts/Harukaze.ttf";

const FontStyles = createGlobalStyle`
  @font-face {
    font-family: 'Harukaze';
    src: url(${Harukaze}) format('woff2')        
  }
`;

export default FontStyles;
