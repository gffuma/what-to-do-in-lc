import {
  SHOW_IMPORT_EVENTS_FULL_DESCRIPTION,
  SHOW_IMPORT_EVENTS_LESS_DESCRIPTION,
  IMPORT_EVENT_START,
  IMPORT_EVENT_COMPLETE,
  IMPORT_EVENT_FAILURE,
  DELETE_IMPORTED_EVENT_START,
  DELETE_IMPORTED_EVENT_COMPLETE,
  DELETE_IMPORTED_EVENT_FAILURE,
  RESYNC_IMPORTED_EVENT_START,
  RESYNC_IMPORTED_EVENT_COMPLETE,
  RESYNC_IMPORTED_EVENT_FAILURE,
  ADD_CATEGORY_TO_EVENT_REQUEST,
  ADD_CATEGORY_TO_EVENT_SUCCESS,
  ADD_CATEGORY_TO_EVENT_FAILURE,
  REMOVE_CATEGORY_FROM_EVENT_REQUEST,
  REMOVE_CATEGORY_FROM_EVENT_SUCCESS,
  REMOVE_CATEGORY_FROM_EVENT_FAILURE,
} from '../../constants/ActionTypes';

const initialState = {
  showFullDescription: {},
  importing: {},
  deleting: {},
  resync: {},
  savingCategories: {}
};

// TODO: Try to implement an hight order reducer...
export default function importEventsUI(state = initialState, action) {
  const { type, fbid } = action;

  switch (type) {
    case ADD_CATEGORY_TO_EVENT_REQUEST:
    case REMOVE_CATEGORY_FROM_EVENT_REQUEST:
      return {
        ...state,
        savingCategories: {
          ...state.savingCategories,
          [fbid]: true
        }
      };

    case ADD_CATEGORY_TO_EVENT_SUCCESS:
    case ADD_CATEGORY_TO_EVENT_FAILURE:
    case REMOVE_CATEGORY_FROM_EVENT_SUCCESS:
    case REMOVE_CATEGORY_FROM_EVENT_FAILURE:
      return {
        ...state,
        savingCategories: {
          ...state.savingCategories,
          [fbid]: false
        }
      };

    case RESYNC_IMPORTED_EVENT_START:
      return {
        ...state,
        resync: {
          ...state.resync,
          [fbid]: true
        }
      };

    case RESYNC_IMPORTED_EVENT_COMPLETE:
    case RESYNC_IMPORTED_EVENT_FAILURE:
      return {
        ...state,
        resync: {
          ...state.resync,
          [fbid]: false
        }
      };

    case DELETE_IMPORTED_EVENT_START:
      return {
        ...state,
        deleting: {
          ...state.deleting,
          [fbid]: true
        }
      };

    case DELETE_IMPORTED_EVENT_COMPLETE:
    case DELETE_IMPORTED_EVENT_FAILURE:
      return {
        ...state,
        deleting: {
          ...state.deleting,
          [fbid]: false
        }
      };

    case IMPORT_EVENT_START:
      return {
        ...state,
        importing: {
          ...state.importing,
          [fbid]: true
        }
      };

    case IMPORT_EVENT_COMPLETE:
    case IMPORT_EVENT_FAILURE:
      return {
        ...state,
        importing: {
          ...state.importing,
          [fbid]: false
        }
      };

    case SHOW_IMPORT_EVENTS_FULL_DESCRIPTION:
      return {
        ...state,
        showFullDescription: {
          ...state.showFullDescription,
          [fbid]: true
        }
      };

    case SHOW_IMPORT_EVENTS_LESS_DESCRIPTION:
      return {
        ...state,
        showFullDescription: {
          ...state.showFullDescription,
          [fbid]: false
        }
      };

    default:
      return state;
  }
}
