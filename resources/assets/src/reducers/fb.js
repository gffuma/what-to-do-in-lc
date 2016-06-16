import { combineReducers } from 'redux';
import {
  SET_FB_ACCESS_TOKEN,
  OBTAIN_FB_ACCESS_TOKEN_REQUEST,
  OBTAIN_FB_ACCESS_TOKEN_SUCCESS,
  OBTAIN_FB_ACCESS_TOKEN_FAILURE
} from '../constants/ActionTypes';

// Facebook app credentials
function app(state = { id: null, secret: null }, action) {
  return state;
}

// Facebook app access
function access(state = { token: null, obtaining: false, error: null }, action) {
  const { type, token, error } = action;

  switch (type) {
    case OBTAIN_FB_ACCESS_TOKEN_REQUEST:
      return { ...state, obtaining: true };

    case OBTAIN_FB_ACCESS_TOKEN_FAILURE:
      return { ...state, error, obtaining: false };

    case OBTAIN_FB_ACCESS_TOKEN_SUCCESS:
      return { ...state, token, error: null, obtaining: false };

    case SET_FB_ACCESS_TOKEN:
      return { ...state, token };

    default:
      return state;
  }
}

export default combineReducers({
  app,
  access,
});
