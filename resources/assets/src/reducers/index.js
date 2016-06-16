import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import fb from './fb';
import laravel from './laravel';
import entities from './entities';
import importEvents from './importEvents';

const rootReducer = combineReducers({
  fb,
  laravel,
  entities,
  importEvents,
  routing,
});

export default rootReducer;
