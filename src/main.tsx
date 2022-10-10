import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { GlobalStyles } from "~/global/styles";
import { MdxProvider } from "~/components/MdxProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <MdxProvider>
      <App />
    </MdxProvider>
  </React.StrictMode>
);
