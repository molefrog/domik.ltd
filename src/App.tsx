import { useState, useRef, useEffect } from "react";
import { Route, Switch, Redirect } from "wouter";

import styled from "@emotion/styled";

import { CipherPage } from "~/components/CipherPage";
import { StoryPage } from "~/components/StoryPage";
import { NextChapterBanner } from "./components/NextChapterBanner";

const DefaultRoute = () => {
  return (
    <Centered>
      <NextChapterBanner launchDate={new Date("2022-10-14")} />
    </Centered>
  );
};

function App() {
  return (
    <Body>
      <Switch>
        <Route path="/enc/:any*" component={CipherPage} />
        <Route path="/story" component={StoryPage} />
        <Route component={DefaultRoute} />
      </Switch>
    </Body>
  );
}

const Body = styled.div``;

const Centered = styled.div`
  display: grid;
  grid-template-columns: minmax(0px, 640px);
  padding: 16px;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
`;

export default App;
