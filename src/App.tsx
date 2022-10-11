import { useState, useRef, useEffect } from "react";
import { Route, Switch, Redirect } from "wouter";

import styled from "@emotion/styled";
import css from "@emotion/css";

import { CipherPage } from "~/components/CipherPage";
import { StoryPage } from "~/components/StoryPage";

const Body = styled.div``;

function App() {
  return (
    <Body>
      <Switch>
        <Route path="/enc/:any*" component={CipherPage} />
        <Route path="/story" component={StoryPage} />

        <Route>
          <Redirect to="/enc" />
        </Route>
      </Switch>
    </Body>
  );
}

export default App;
