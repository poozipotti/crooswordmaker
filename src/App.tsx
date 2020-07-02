import React from "react";
import styled from "styled-components";
import { Editor } from "./components/Crossword/Editor";
import { Solver } from "./components/Crossword/Solver";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

const AppContainer = styled.div`
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Link to="/edit">Editor</Link><br/>
        <Link to="/solve">Solver</Link>
        <Switch>
          <Redirect exact from="/" to="/edit" />
          <Route path="/edit">
            <Editor/>
          </Route>
          <Route path="/solve">
            <Solver/>
          </Route>
        </Switch>
      </AppContainer>
    </Router>
  );
}

export default App;
