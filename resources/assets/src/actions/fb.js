import fetch from 'isomorphic-fetch';
import { camelizeKeys } from 'humps';
import {
  SET_FB_ACCESS_TOKEN,
  OBTAIN_FB_ACCESS_TOKEN_REQUEST,
  OBTAIN_FB_ACCESS_TOKEN_SUCCESS,
  OBTAIN_FB_ACCESS_TOKEN_FAILURE
} from '../constants/ActionTypes';

const GRAPH_API_URL = 'https://graph.facebook.com';
const GRAPH_API_VERSION = 'v2.6';

// TODO: Better fetch wrapper O__o
export function graphApi(endpoint, fetchConfig = {}) {
  return (dispatch, getState) => {
    const accessToken = getState().fb.access.token;

    const query = (endpoint.indexOf('?') === -1 ? '?' : '&') +
                  `access_token=${accessToken}`;
    const url = endpoint.startsWith(GRAPH_API_URL)
      ? endpoint
      : `${GRAPH_API_URL}/${GRAPH_API_VERSION}${endpoint}${query}`

    return fetch(url, fetchConfig)
      .then(response =>
        response.json().then(json => ({ json: camelizeKeys(json), response }))
      )
      .then(({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      });
  };
};

export const setAccessToken = (token) => ({
  type: SET_FB_ACCESS_TOKEN,
  token
});

export function obtainAcessToken() {
  return (dispatch, getState) => {
    const { id, secret } = getState().fb.app;

    dispatch({ type: OBTAIN_FB_ACCESS_TOKEN_REQUEST });
    fetch(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/oauth/access_token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`)
      .then(response =>
        response.json().then(json => ({ json, response }))
      )
      .then(({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
      .then(
        response => {
          const token = response.access_token;
          // Update local storage
          localStorage.setItem('fb_app_access_token', token);
          // Set in store
          setTimeout(() => dispatch({
            type: OBTAIN_FB_ACCESS_TOKEN_SUCCESS,
            token
          }), 5000);
        },
        response => dispatch({ type: OBTAIN_FB_ACCESS_TOKEN_FAILURE, error: response })
      )
  };
};
