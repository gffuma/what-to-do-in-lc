import { MERGE_ENTITIES } from '../constants/ActionTypes';

export const mergeEntities = (entities) => ({
  type: MERGE_ENTITIES,
  entities
});
