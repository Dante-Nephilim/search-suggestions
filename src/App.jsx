import "./App.css";
import AutoSuggest from "./components/AutoSuggest";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";

const UserInfo = lazy(() => import("./pages/UserInfo"));

function App() {
  return (
    <Router>
      <div className="App">
        <div className="mt-14 text-lg hover:text-blue-700 hover:underline">
          <a
            href="https://github.com/Dante-Nephilim"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Link
          </a>
        </div>
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
