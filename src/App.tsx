import { Route, Switch, Redirect } from "wouter";
import styled from "@emotion/styled";

import { CipherPage } from "~/components/CipherPage";
import { StoryPage } from "~/components/StoryPage";
import { IndexPage } from "~/components/IndexPage";

function App() {
  return (
    <Body>
      <Switch>
        <Route path="/" component={IndexPage} />
        <Route path="/x/:any*" component={CipherPage} />
        <Route path="/story" component={StoryPage} />

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Body>
  );
}

const Body = styled.div``;

export default App;
