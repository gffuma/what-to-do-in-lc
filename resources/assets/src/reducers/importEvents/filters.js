import {
  SHOW_ALREADY_IMPORTED_EVENTS,
  HIDE_ALREADY_IMPORTED_EVENTS,
} from '../../constants/ActionTypes';

const initialState = {
  showAlredyImportedEvents: false,
};

export default function filtersImportEvents(state = initialState, action) {
  const { type } = action;

  if (type === SHOW_ALREADY_IMPORTED_EVENTS) {
    return { ...state, showAlredyImportedEvents: true };
  }

  if (type === HIDE_ALREADY_IMPORTED_EVENTS) {
    return { ...state, showAlredyImportedEvents: false };
  }

  return state;
}
