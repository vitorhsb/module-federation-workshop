import { Switch, Route, Router, Redirect } from "react-router-dom";
import Session from "./Session";
import SessionList from "./SessionList";

export default function App({ history }) {
  return (
    <Router history={history}>
      <Switch>
        {/* <Route path="/sessions/:id">
          <Session />
        </Route>
        <Route path="/sessions">
          <SessionList />
        </Route> */}
        <Route path="/:id">
          <Session />
        </Route>
        <Route path="/">
          <SessionList />
        </Route>
      </Switch>
    </Router>
  );
}
