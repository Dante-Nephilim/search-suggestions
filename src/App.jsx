import "./App.css";
import AutoSuggest from "./components/AutoSuggest";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";

const UserInfo = lazy(() => import("./pages/UserInfo"));

function App() {
  return (
    <Router>
      <div className="App mt-5">
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={AutoSuggest} />
            <Route path="/users/:id" component={UserInfo} />
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
