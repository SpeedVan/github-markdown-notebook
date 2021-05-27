import React from 'react';
import { Switch, Route, HashRouter as Router, Redirect } from 'react-router-dom';

import Welcome from './pages/Welcome'
import Editor from './pages/Main'


const App: React.FC = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Welcome />
      </Route>
      <Route exact path="/main">
        <Redirect to="/main/notebook" />
      </Route>
      <Route exact path="/main/*">
        <Editor />
      </Route>
    </Switch>
  </Router>
)

export default App;
