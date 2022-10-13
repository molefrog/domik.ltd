import { Route, Switch, Redirect } from "wouter";
import styled from "@emotion/styled";

import { CipherPage } from "~/components/CipherPage";
import { StoryPage } from "~/components/StoryPage";
import { IndexPage } from "~/components/IndexPage";

import { usePreloadedResources } from "~/preloadResources";

function App() {
  usePreloadedResources();

  return (
    <Body>
      <Switch>
        <Route path="/" component={IndexPage} />
        <Route path="/x/:any*" component={CipherPage} />
        <Route path="/s" component={StoryPage} />

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Body>
  );
}

const Body = styled.div``;

export default App;
