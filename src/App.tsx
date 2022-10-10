import { useState } from "react";

import styled from "@emotion/styled";
import css from "@emotion/css";
import ChapterOne from "./chapters/1-one/story.mdx";

const Body = styled.div`
  max-width: 700px;
  margin: 16px auto;

  img {
    width: 70%;
  }
`;

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Body>
        <ChapterOne />
      </Body>
    </div>
  );
}

export default App;
