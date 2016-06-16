import { merge } from 'lodash';
import { MERGE_ENTITIES } from '../constants/ActionTypes';

const initialState = {
  fbEvents: {},
  importedEvents: {},
};

export default function entities(state = initialState, action) {
  if (action.type === MERGE_ENTITIES) {
    return merge({}, state, action.entities);
  }

  return state
}
