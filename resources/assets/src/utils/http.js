import { decamelizeKeys, camelizeKeys } from 'humps';

export const jsonPostConfig = (body = {}) => ({
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(decamelizeKeys(body))
});

export const jsonPutConfig = (body = {}) => ({
  method: 'put',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(decamelizeKeys(body))
});

export const deleteConfig = () => ({
  method: 'delete'
});

export const handleFetchError = fetchError =>
  Promise.reject({ fetchError });

export const handleFetchSuccess = response => {
  // 204 No Content no need to parse json...
  if (response.status === 204) {
    return null;
  }
  return response.json().then(
    json => ({
      json: camelizeKeys(json),
      response
    }),
    () => Promise.reject({ response })
  )
  .then(({ response, json }) => {
    if (!response.ok) {
      return Promise.reject({ response, json });
    }
    return json;
  });
};
