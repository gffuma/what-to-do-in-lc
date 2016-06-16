import { combineReducers } from 'redux';
import { concat } from 'lodash';
import {
  LOAD_IMPORT_EVENTS_START,
  LOAD_IMPORT_EVENTS_COMPLETE,
  LOAD_IMPORT_EVENTS_FAILURE
} from '../constants/ActionTypes';

const initialState = {
  ids: [],
  loading: false,
  error: null,
  nextUrl: null,
};

export default function importEvents(state = initialState, action) {

  if (action.type === LOAD_IMPORT_EVENTS_COMPLETE) {
    return {...state, ids: concat(state.ids, action.ids), nextUrl: action.paging.next };
  }

  return state;
};
