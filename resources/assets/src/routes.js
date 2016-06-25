import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ImportEventsPage from './containers/ImportEventsPage';
import Categories from './components/Categories';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="import" component={ImportEventsPage} />
    <Route path="categories" component={Categories} />
  </Route>
);
