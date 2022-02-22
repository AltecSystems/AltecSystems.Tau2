import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
const HomePage = React.lazy(() => import("./Pages/HomePage/homePage"));

interface AppProps {}

interface AppState {}

export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {};
  }

  /* TODO: migrate to new react-router and add loading 'line' on top of the page*/
  render(): JSX.Element {
    return (
      <Switch>
        {/** TODO move root path to env */}
        <Route
          path={"/Tau2Calculator"}
          render={() => (
            <React.Suspense fallback={<></>}>
              <HomePage />
            </React.Suspense>
          )}
        />

        {/** TODO move root path to env */}
        <Redirect to={"/Tau2Calculator"} />
      </Switch>
    );
  }
}
