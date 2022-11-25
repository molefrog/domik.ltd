import { Route, Switch as Switch, Redirect } from "wouter";
import { lazy } from "react";
import styled from "@emotion/styled";

import { CipherPage } from "~/components/CipherPage";
import { StoryPage } from "~/components/StoryPage";
import { IndexPage } from "~/components/IndexPage";
import { TVPlayer } from "./attractions/TV";

import { usePreloadedResources } from "~/preloadResources";

const PlaygroundPage = lazy(() => import("~/components/PlaygroundPage"));

function App() {
  usePreloadedResources();

  return (
    <Body>
      <Switch>
        <Route path="/" component={IndexPage} />
        <Route path="/x/:any*" component={CipherPage} />
        <Route path="/story/:any*" component={StoryPage} />

        {import.meta.env.DEV && <Route component={PlaygroundPage} />}

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>

      <TVPlayer />
    </Body>
  );
}

const Body = styled.div``;

export default App;
