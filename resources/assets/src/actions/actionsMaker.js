import { isObject, isFunction, merge } from 'lodash';

const callItMaybe = (f) => {
  if (isObject(f)) {
    return f;
  } else if (isFunction(f)) {
    return f() || {};
  } else {
    return {};
  }
};

export const makeActions = ({ types = [], data = {}, actionsData = [] }) =>
  types.map((type, i) => (extraActionData) => ({
    type,
    ...callItMaybe(data),
    ...callItMaybe(actionsData[i]),
    ...callItMaybe(extraActionData)
  }));

export const makeAsyncActions = ({ types = [], data = {}, actionsData = [] }) => makeActions({
  types,
  data,
  actionsData: merge(actionsData, [
    { status: 'start' },
    { status: 'complete' },
    { status: 'failure' }
  ])
});
