import { merge, omit, isArray, reduce, mapValues, assign } from 'lodash';
import {
  MERGE_ENTITIES,
  REMOVE_ENTITIES
} from '../constants/ActionTypes';

const initialState = {
  fbEvents: {},
  importedEvents: {},
  categories: {},
};

// Two level deep shallow merge only
const mergeEntities = (entities, mergedEntities) =>
  mapValues(entities, (v, k) => assign({}, v, mergedEntities[k]));

// Remove entities keys...
// le entities is like this:
// { fbEvents: [1, 2, 3], importedEvents: [1] }
// will remove keys 1,2 and 3 from fbEvents and key 1 from importedEvents
const removeEntities = (entities, removedEntities) =>
  reduce(removedEntities, (e, v, k) => ({
    ...e, [k]: omit(e[k], isArray(v) ? v : [v])
  }), entities);

export default function entities(state = initialState, action) {
  if (action.type === MERGE_ENTITIES) {
    return mergeEntities(state, action.entities);
  }

  if (action.type === REMOVE_ENTITIES) {
    return removeEntities(state, action.entities);
  }

  return state;
}
