import { Global, css } from "@emotion/react";

import gratoRegular from "./fonts/Grato Marker-Regular-Web.woff2";
import gratoMedium from "./fonts/Grato Marker-Medium-Web.woff2";
import gratoBold from "./fonts/Grato Marker-Bold-Web.woff2";

const styles = css`
  :root {
    /* color pallete */
    --color-banana-yellow: #f9e9b3;
    --color-banana-dark-yellow: #f5d97b;
    --color-carrara: #efefe5;
    --color-iron-gray: #d6d6d6;

    --color-bg: #fffff9;
    --color-text: #002129;
    --color-selected: var(--color-banana-dark-yellow);
    --color-selected-light: var(--color-banana-yellow);
    --color-embossed: var(--color-carrara);
    --color-embossed-dark: #cbcbab;
    --color-text-highlight: #e386b2;

    font-size: 20px;
    line-height: 30px;
    font-weight: normal;
    font-family: Grato Marker;

    color-scheme: normal;
    color: var(--color-text);
    background-color: var(--color-bg);

    box-sizing: border-box;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    /* Grato Marker looks better when it's subpixel-antialiased */
    -webkit-font-smoothing: subpixel-antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  a {
    text-decoration: inherit;
  }

  @font-face {
    font-family: Grato Marker;
    font-weight: 400;
    src: url("${gratoRegular}") format("woff2");
  }

  @font-face {
    font-family: Grato Marker;
    font-weight: 700;
    src: url("${gratoMedium}") format("woff2");
  }

  @font-face {
    font-family: Grato Marker;
    font-weight: 900;
    src: url("${gratoBold}") format("woff2");
  }

  @media (prefers-color-scheme: dark) {
    /* dark theme */
  }
`;

export const GlobalStyles = () => <Global styles={styles} />;
