import { concat, uniq } from 'lodash';
import {
  LOAD_IMPORT_EVENTS_START,
  LOAD_IMPORT_EVENTS_COMPLETE,
  LOAD_IMPORT_EVENTS_FAILURE
} from '../../constants/ActionTypes';

const initialState = {
  ids: [],
  loading: false,
  error: null,
  nextUrl: null,
};

export default function importEventsList(state = initialState, action) {
  const { type, ids, paging, error } = action;

  switch (type) {
    case LOAD_IMPORT_EVENTS_START:
      return {
        ...state,
        loading: true
      };

    case LOAD_IMPORT_EVENTS_COMPLETE:
      return {
        ...state,
        ids: uniq(concat(state.ids, ids)),
        nextUrl: paging.next,
        loading: false
      };

    case LOAD_IMPORT_EVENTS_FAILURE:
      return {
        ...state,
        error,
        loading: false
      };

    default:
      return state;
  }
};
