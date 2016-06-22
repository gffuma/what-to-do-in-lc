import { normalize } from 'normalizr';
import { graphApi } from './fb';
import { dashboardApi } from './laravel';
import { jsonPostConfig, deleteConfig } from '../utils/fetch';
import { property, difference, uniq, omit} from 'lodash';
import { mergeEntities, removeEntities } from './entities';
import Schemas from '../schemas';
import {
  LOAD_IMPORT_EVENTS_START,
  LOAD_IMPORT_EVENTS_COMPLETE,
  LOAD_IMPORT_EVENTS_FAILURE,
  IMPORT_EVENT_START,
  IMPORT_EVENT_COMPLETE,
  IMPORT_EVENT_FAILURE,
  SHOW_ALREADY_IMPORTED_EVENTS,
  HIDE_ALREADY_IMPORTED_EVENTS,
  SHOW_IMPORT_EVENTS_FULL_DESCRIPTION,
  SHOW_IMPORT_EVENTS_LESS_DESCRIPTION,
  DELETE_IMPORTED_EVENT_START,
  DELETE_IMPORTED_EVENT_COMPLETE,
  DELETE_IMPORTED_EVENT_FAILURE
} from '../constants/ActionTypes';

const fbEventRe = /^https:\/\/www\.facebook\.com\/events\/([0-9]+)/;

// Grab facebook events ids from links in reponse
function grabFbEventsIdsFromLinks(links) {
  return links.reduce((r, v) => {
    const matches = v ? v.match(fbEventRe) : false;
    return matches ? [...r, matches[1]] : r;
  }, []);
}

const fbEventsByIds = (fbids) => (dispatch, getState) =>
  dispatch(graphApi(`/?ids=${fbids.join(',')}`));

const fbEventById = (fbid) => (dispatch, getState) =>
  dispatch(graphApi(`/${fbid}`));

const promiseForFreshFbEventById = (fbid) => (dispatch, getState) => {
  const fbEvent = getState().entities.fbEvents[fbid];
  return fbEvent
     // Cached fb event without shit...
    ? Promise.resolve(omit(fbEvent, ['categories']))
    // Ask to Mark...
    : dispatch(fbEventById(fbid));
};

const importedEventsByFbIds = (fbids) => (dispatch, getState) =>
  dispatch(dashboardApi(`/events/fb?fbids=${fbids.join(',')}`))
    // Normalize data...
    .then(data => {
      const { entities, result } = normalize(data, Schemas.IMPORTED_EVENT_ARRAY);
      return { fbIds: result, entities };
    });

// TODO: In a very far future we can get events from differte sources...
const getFbIdsToImport = () => (dispatch, getState) => {
  // TODO: Maybe move in store!
  const fbPageId = 'cosafarealecco'; // Hardcoded with endless love...
  const importUrl = getState().importEvents.list.nextUrl || `/${fbPageId}/posts?fields=link`;

  return dispatch(graphApi(importUrl))
    .then(response => {
      // List of ~~NEW~~ candidate facebook events ids to import
      const fbIdsToImport = difference(
        uniq(grabFbEventsIdsFromLinks(response.data.map(property('link')))),
        getState().importEvents.ids
      );

      // Import response pagination stuff...
      const paging = response.paging || {};

      return { fbIdsToImport, paging };
    });
};

// Delete imported event
export function deleteImportedEvent(fbid) {
  return (dispatch, getState) => {
    const importedEvent = getState().entities.importedEvents[fbid];

    // Invalid fbid
    if (!importedEvent) {
      throw new Error(`Invalid provided facebook id ${fbid} to remove.`);
    }

    // TODO: Util function for error handlers
    // Error handler for the various http calls...
    // Both Laravel API and Facebook Graph API
    const handleError = response => dispatch({
      type: DELETE_IMPORTED_EVENT_FAILURE,
      error: response.error || response,
      fbid
    });

    dispatch({ type: DELETE_IMPORTED_EVENT_START, fbid });

    dispatch(promiseForFreshFbEventById(fbid))
      .then(fbEvent => {
        // Delete from imported events...
        dispatch(dashboardApi(`/events/fb/${fbid}`, deleteConfig()))
          .then(() => {
            // Merge fresh(?) facebook event in entities and remove the imported event
            dispatch(mergeEntities({
              fbEvents: { [fbid]: fbEvent }
            }));
            dispatch(removeEntities({
              importedEvents: fbid
            }));
            dispatch({ type: DELETE_IMPORTED_EVENT_COMPLETE, fbid });
          }, handleError);
      }, handleError);
  };
};

// Import event
export function importEvent(fbid) {
  return (dispatch, getState) => {
    const fbEvent = getState().entities.fbEvents[fbid];

    // Invalid fbid
    if (!fbEvent) {
      throw new Error(`Invalid provided facebook id ${fbid} to import.`);
    }

    dispatch({ type: IMPORT_EVENT_START, fbid });

    // TODO: Better import
    const fetchConfig = jsonPostConfig({
      fbid,
      name: fbEvent.name,
      description: fbEvent.description,
    });
    dispatch(dashboardApi(`/events/fb`, fetchConfig))
      .then(
        event => {
          dispatch(mergeEntities({
            ...normalize(event, Schemas.IMPORTED_EVENT).entities
          }));
          dispatch({ type: IMPORT_EVENT_COMPLETE, fbid });
        },
        // TODO: Improve error handling
        response => dispatch({
          type: IMPORT_EVENT_FAILURE,
          error: response.error,
          fbid
        })
      );
  };
}

// Load events for importing later...
export function loadImportEvents() {
  return (dispatch, getState) => {
    // Start the odissea

    // I Fucking love spinners XD
    dispatch({ type: LOAD_IMPORT_EVENTS_START });

    // Error handler for the various http calls...
    // Both Laravel API and Facebook Graph API
    const handleError = response => dispatch({
      type: LOAD_IMPORT_EVENTS_FAILURE,
      error: response.error || response
    });

    dispatch(getFbIdsToImport())
      .then(({ fbIdsToImport, paging }) => {

        // No new events posted by page... Import complete!
        if (fbIdsToImport.length === 0) {
          dispatch({
            paging,
            type: LOAD_IMPORT_EVENTS_COMPLETE,
            ids: fbIdsToImport
          });
          return;
        }

        dispatch(importedEventsByFbIds(fbIdsToImport))
          .then(({ fbIds, entities }) => {
            const notImportedFbIds = difference(fbIdsToImport, fbIds);

            // All facebook ids are alredy imported... Import complete!
            if (notImportedFbIds.length === 0) {
              dispatch(mergeEntities({
                ...entities
              }));
              dispatch({
                paging,
                type: LOAD_IMPORT_EVENTS_COMPLETE,
                ids: fbIdsToImport
              });
              return;
            }

            dispatch(fbEventsByIds(notImportedFbIds))
              .then(fbEvents => {
                  // Some ids could be invalid...
                  const importedFbIds = fbIdsToImport.filter(fbid =>
                    entities.importedEvents[fbid] || fbEvents[fbid]
                  );
                  // Finally can back to Itaca!
                  dispatch(mergeEntities({
                    fbEvents,
                    ...entities
                  }));
                  dispatch({
                    paging,
                    type: LOAD_IMPORT_EVENTS_COMPLETE,
                    ids: importedFbIds
                  });
              }, handleError);
          }, handleError);
      }, handleError);
  };
}

export const showAlredyImportedEvents = () => ({
  type: SHOW_ALREADY_IMPORTED_EVENTS
});

export const hideAlredyImportedEvents = () => ({
  type: HIDE_ALREADY_IMPORTED_EVENTS
});

export const showFullDescription = (fbid) => ({
  fbid,
  type: SHOW_IMPORT_EVENTS_FULL_DESCRIPTION
});

export const showLessDescription = (fbid) => ({
  fbid,
  type: SHOW_IMPORT_EVENTS_LESS_DESCRIPTION
});
