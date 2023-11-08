import { lazy } from "react";
import styled from "@emotion/styled";

import { Route, Router, Switch as Switch, Redirect, useSearch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { useBrowserLocation } from "wouter/use-browser-location";

import { CipherPage } from "~/components/CipherPage";
import { StoryPage } from "~/components/StoryPage";
import { IndexPage } from "~/components/IndexPage";
import { TVPlayer } from "./attractions/TV";

import { usePreloadedResources } from "~/preloadResources";
import { RoutesWithLocale } from "./i18n/locale";

const PlaygroundPage = lazy(() => import("~/components/PlaygroundPage"));

function App() {
  usePreloadedResources();

  const search = useSearch();
  const locationHook = search === "hash-router" ? useHashLocation : useBrowserLocation;

  return (
    <Router hook={locationHook}>
      <RoutesWithLocale>
        <Body>
          <Switch>
            <Route path="/" component={IndexPage} />
            <Route path="/x/*?" component={CipherPage} />
            <Route path="/story/*?" component={StoryPage} />

            {import.meta.env.DEV && <Route path="/playground" component={PlaygroundPage} />}

            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>

          <TVPlayer />
        </Body>
      </RoutesWithLocale>
    </Router>
  );
}

const Body = styled.div``;

export default App;
