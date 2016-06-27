import { combineReducers } from 'redux';
import list from './list';
import filters from './filters';
import ui from './ui';

const importEvents = combineReducers({
  list,
  filters,
  ui,
});

function multiSourceImportEvents(state = {}, action) {
  const { fbSourceId } = action;

  if (fbSourceId) {
    return {
      ...state,
      [fbSourceId]:  importEvents(state[fbSourceId], action)
    };
  }

  return state;
}

export default multiSourceImportEvents;
