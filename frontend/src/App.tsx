import React from 'react';
import 'antd/dist/antd.css';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';

import Welcome from './pages/Welcome'
import Editor from './pages/Editor'


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
