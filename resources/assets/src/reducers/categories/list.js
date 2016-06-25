import { concat, uniq } from 'lodash';
import {
  CATEGORIES_REQUEST,
  CATEGORIES_SUCCESS,
  CATEGORIES_FAILURE
} from '../../constants/ActionTypes';

const initialState = {
  ids: [],
  loading: false,
  error: null,
};

export default function importEventsList(state = initialState, action) {
  const { type, ids, error } = action;

  switch (type) {
    case CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true
      };

    case CATEGORIES_SUCCESS:
      return {
        ...state,
        ids,
        loading: false
      };

    case CATEGORIES_FAILURE:
      return {
        ...state,
        error,
        loading: false
      };

    default:
      return state;
  }
};
