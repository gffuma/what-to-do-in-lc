import fetch from 'isomorphic-fetch';
import { makeAsyncActions } from './actionsMaker';
import { handleFetchSuccess, handleFetchError } from '../utils/http';
import {
  SET_FB_ACCESS_TOKEN,
  OBTAIN_FB_ACCESS_TOKEN_REQUEST,
  OBTAIN_FB_ACCESS_TOKEN_SUCCESS,
  OBTAIN_FB_ACCESS_TOKEN_FAILURE
} from '../constants/ActionTypes';

const GRAPH_API_URL = 'https://graph.facebook.com';
const GRAPH_API_VERSION = 'v2.6';

export function graphApi(endpoint, fetchConfig = {}) {
  return (dispatch, getState) => {
    const accessToken = getState().fb.access.token;

    const query = (endpoint.indexOf('?') === -1 ? '?' : '&') +
                  `access_token=${accessToken}`;
    const url = endpoint.startsWith(GRAPH_API_URL)
      ? endpoint
      : `${GRAPH_API_URL}/${GRAPH_API_VERSION}${endpoint}${query}`

    return fetch(url, fetchConfig)
      .then(handleFetchSuccess, handleFetchError);
  };
};

export const handleFbError = (rejection, notify = true) => {
  // Make message from rejection...
  let message;
  if (rejection.fetchError) {
    // Fetch error...
    message = 'Unavailable Facebook graph service';
  } else if (rejection.json) {
    // Using facebook error message as message
    message = `Facebook graph call failed with ${rejection.json.error.message}`;
  } else if (rejection.response.ok) {
    // 200 But failed to parse json
    message = 'Failed to parse Facebook graph response';
  } else {
    // Bad status with no json, using the status as message
    message = `Facebook graph call failed with ${rejection.response.statusText}`;
  }

  // Error for reducers...
  const error = {
    message,
    response: rejection.response,
    fb: true,
  };

  // Add notify
  if (notify) {
    return {
      error,
      notify: {
        message,
        options: { addnCls: 'humane-libnotify-error' }
      }
    };
  } else {
    return {
      error,
    };
  }
};

export const setAccessToken = (token) => ({
  type: SET_FB_ACCESS_TOKEN,
  token
});

export function obtainAcessToken() {
  return (dispatch, getState) => {
    const { id, secret } = getState().fb.app;
    const [ request, success, fail ] = makeAsyncActions({
      types: [
        OBTAIN_FB_ACCESS_TOKEN_REQUEST,
        OBTAIN_FB_ACCESS_TOKEN_SUCCESS,
        OBTAIN_FB_ACCESS_TOKEN_FAILURE
      ]
    });

    dispatch(request());
    fetch(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/oauth/access_token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`)
      .then(handleFetchSuccess, handleFetchError)
      .then(({ accessToken }) => {
        // Update local storage
        localStorage.setItem('fb_app_access_token', accessToken);
        // Set in store
        dispatch(success({ token: accessToken }));
      }, (r) => fail(handleFbError(r)));
  };
};
