import React from 'react';
import { Switch, Route, HashRouter as Router, Redirect } from 'react-router-dom';

import Welcome from './pages/Welcome'
import Main from './pages/Main'


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
        <Main />
      </Route>
    </Switch>
  </Router>
)

export default App;
