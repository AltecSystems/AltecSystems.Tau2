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
        <Route
          exact
          path={"/"}
          render={() => (
            <React.Suspense fallback={<></>}>
              <HomePage />
            </React.Suspense>
          )}
        />
        <Redirect to={"/"} />
      </Switch>
    );
  }
}
