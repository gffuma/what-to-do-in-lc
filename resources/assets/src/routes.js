import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HelloPage from './containers/HelloPage';
import ImportEventsPage from './containers/ImportEventsPage';
import Categories from './components/Categories';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HelloPage} />
    <Route path="import" component={ImportEventsPage} />
    <Route path="events" component={HelloPage} />
    <Route path="categories" component={Categories} />
  </Route>
);
