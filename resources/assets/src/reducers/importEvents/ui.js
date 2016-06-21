import {
  SHOW_IMPORT_EVENTS_FULL_DESCRIPTION,
  SHOW_IMPORT_EVENTS_LESS_DESCRIPTION,
  IMPORT_EVENT_START,
  IMPORT_EVENT_COMPLETE,
  IMPORT_EVENT_FAILURE,
  DELETE_IMPORTED_EVENT_START,
  DELETE_IMPORTED_EVENT_COMPLETE,
  DELETE_IMPORTED_EVENT_FAILURE
} from '../../constants/ActionTypes';

const initialState = {
  showFullDescription: {},
  importing: {},
  deleting: {},
};

export default function importEventsUI(state = initialState, action) {
  const { type, fbid } = action;

  switch (type) {
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
