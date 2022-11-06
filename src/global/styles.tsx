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
    --color-twilight-blue: #f6f6ed;

    --color-bg: #fffff9;
    --color-text: #002129;
    --color-text-gray: #627474;

    --color-selected-rgb: 245 217 123;
    --color-selected: rgb(var(--color-selected-rgb));

    --color-selected-light: var(--color-banana-yellow);
    --color-selected-vivid: #fac753;
    --color-embossed: var(--color-twilight-blue);
    --color-embossed-dark: var(--color-carrara);
    --color-text-highlight: #e386b2;
    --color-subtle-gray: #eaeaea;

    font-size: 20px;
    line-height: 30px;
    font-weight: normal;
    font-family: Grato Marker, system-ui;

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

  body {
    margin: 0;
    padding: 0;
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
    font-display: swap;
  }

  @font-face {
    font-family: Grato Marker;
    font-weight: 700;
    src: url("${gratoMedium}") format("woff2");
    font-display: swap;
  }

  @font-face {
    font-family: Grato Marker;
    font-weight: 900;
    src: url("${gratoBold}") format("woff2");
    font-display: swap;
  }

  @media (prefers-color-scheme: dark) {
    /* dark theme */
  }
`;

export const GlobalStyles = () => <Global styles={styles} />;
