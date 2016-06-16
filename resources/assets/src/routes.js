import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HelloPage from './containers/HelloPage';
import ImportEventsPage from './containers/ImportEventsPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HelloPage} />
    <Route path="import" component={ImportEventsPage} />
  </Route>
);
