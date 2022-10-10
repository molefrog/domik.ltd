import { useState } from "react";

import styled from "@emotion/styled";
import css from "@emotion/css";

const Body = styled.div`
  width: 704px;
  margin: 32px auto;
`;

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Body>Nothing to see here yet!</Body>
    </div>
  );
}

export default App;
