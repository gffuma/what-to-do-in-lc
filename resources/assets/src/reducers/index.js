import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import fb from './fb';
import laravel from './laravel';
import entities from './entities';
import importEvents from './importEvents';
import categories from './categories';
import user from './user';

const rootReducer = combineReducers({
  fb,
  laravel,
  user,
  entities,
  importEvents,
  categories,
  routing,
});

export default rootReducer;
