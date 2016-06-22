import fetch from 'isomorphic-fetch';

export function dashboardApi(endpoint, additionalConfig = {}) {
  return (dispatch, getState) => {
    const { csrfToken } = getState().laravel;

    const url = `/api${endpoint}`;
    const fetchConfig = {
      ...additionalConfig,
      credentials: 'same-origin',
      headers: {
        ...additionalConfig.headers,
        'X-CSRF-TOKEN': csrfToken
      }
    };

    // TODO: Better fetch wrapper O__o
    return fetch(url, fetchConfig)
      .then(response => {
        if (response.status === 204) { // No Content
          return { json: null, response };
        }
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      });
  };
};
