import {
  MERGE_ENTITIES,
  REMOVE_ENTITIES
} from '../constants/ActionTypes';

export const mergeEntities = (entities) => ({
  type: MERGE_ENTITIES,
  entities
});

export const removeEntities = (entities) => ({
  type: REMOVE_ENTITIES,
  entities
});
