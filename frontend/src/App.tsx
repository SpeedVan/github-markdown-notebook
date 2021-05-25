import React from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';

import Welcome from './pages/Welcome'
import Editor from './pages/Main'


const App: React.FC = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Welcome />
      </Route>
      <Route exact path="/editor">
        <Editor />
      </Route>
    </Switch>
  </Router>
)

export default App;
