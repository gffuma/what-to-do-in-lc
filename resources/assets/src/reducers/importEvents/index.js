import { combineReducers } from 'redux';
import list from './list';
import filters from './filters';
import ui from './ui';

export default combineReducers({
  list,
  filters,
  ui,
});
