export const jsonPostConfig = (body = {}) => ({
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

export const jsonPutConfig = (body = {}) => ({
  method: 'put',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

export const deleteConfig = () => ({
  method: 'delete'
});
