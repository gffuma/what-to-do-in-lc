import fetch from 'isomorphic-fetch';
import { handleFetchSuccess, handleFetchError } from '../utils/http';

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

    return fetch(url, fetchConfig)
      .then(handleFetchSuccess, handleFetchError)
  };
};

export const handleDashError = (rejection, notify = true) => {
  // Make message from rejection...
  let message;
  if (rejection.fetchError) {
    // Fetch error...
    message = 'Unavailable API service';
  } else if (rejection.json) {
    // Using facebook error message as message
    message = `API call failed with ${rejection.json.error}`;
  } else if (rejection.response.ok) {
    // 200 But failed to parse json
    message = 'Failed to parse API response';
  } else {
    // Bad status with no json, using the status as message
    message = `API call failed with ${rejection.response.statusText}`;
  }

  // Error for reducers...
  const error = {
    message,
    response: rejection.response,
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
