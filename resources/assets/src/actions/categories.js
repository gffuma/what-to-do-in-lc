import { normalize } from 'normalizr';
import { dashboardApi, handleDashError } from './laravel';
import { makeAsyncActions } from './actionsMaker';
import { mergeEntities, removeEntities } from './entities';
import Schemas from '../schemas';
import {
  CATEGORIES_REQUEST,
  CATEGORIES_SUCCESS,
  CATEGORIES_FAILURE
} from '../constants/ActionTypes';

export function loadCategories() {
  return (dispatch, getState) => {
    const [ request, success, fail ] = makeAsyncActions({
      types: [
        CATEGORIES_REQUEST,
        CATEGORIES_SUCCESS,
        CATEGORIES_FAILURE
      ]
    });

    dispatch(request());
    dispatch(dashboardApi(`/categories`))
      .then(categories => {
        const { entities, result } = normalize(categories, Schemas.CATEGORY_ARRAY);
        dispatch(mergeEntities({ ...entities }));
        dispatch(success({ ids: result }));
      }, (r) => fail(handleDashError(r)));
  };
};
