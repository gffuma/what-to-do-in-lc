import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import bootstrapStore from './store/bootstrapStore';
import Root from './containers/Root';

const store = configureStore(window.__INITIAL_STATE__ || {});
const history = syncHistoryWithStore(browserHistory, store);

// Bootstrapping the store
bootstrapStore(store);

ReactDom.render(
  <Root store={store} history={history} />,
  document.getElementById('react-root')
);
