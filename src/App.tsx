import { useState, useRef, useEffect } from "react";
import { Route, Switch, Redirect } from "wouter";

import styled from "@emotion/styled";
import css from "@emotion/css";

import { CipherPage } from "./components/CipherPage";
import ChapterOne from "./chapters/1-one/story.mdx";

const ChapterContent = styled.div`
  max-width: 700px;
  margin: 16px auto;
`;

const Book = () => {
  return (
    <ChapterContent>
      <ChapterOne />
    </ChapterContent>
  );
};

const Body = styled.div``;

function App() {
  const [showChapter, setShowChapter] = useState(false);

  return (
    <Body>
      <Switch>
        <CipherPage key={"ciph"} />
        <Route path="/enc/:any*">
          <CipherPage />
        </Route>

        <Route path="/story" component={Book} />

        <Route>
          <Redirect to="/enc" />
        </Route>
      </Switch>
    </Body>
  );
}

export default App;
