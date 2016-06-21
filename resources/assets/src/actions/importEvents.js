import { graphApi } from './fb';
import { dashboardApi } from './laravel';
import { jsonPostConfig, deleteConfig } from '../utils/fetch';
import { property, keys, difference, uniq } from 'lodash';
import { mergeEntities, removeEntities } from './entities';
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

const importedEventsByFbIds = (fbids) => (dispatch, getState) =>
  dispatch(dashboardApi(`/events/by-fbids/${fbids.join(',')}`));


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

    // Ask Mark for fb event if not in the store...
    const promiseForFbEvent = (() => {
      const fbEvent = getState().entities.fbEvents[fbid];
      return fbEvent ? Promise.resolve(fbEvent) : dispatch(fbEventById(fbid));
    })();

    promiseForFbEvent
      .then(fbEvent => {
        const { id } = importedEvent;

        // Delete from imported events...
        dispatch(dashboardApi(`/events/${id}`, deleteConfig()))
          .then(deletedEvent => {
            dispatch({ type: DELETE_IMPORTED_EVENT_COMPLETE, fbid });
            // Merge fresh(?) fbEvent in entities and remove the imported event
            dispatch(mergeEntities({
              fbEvents: { [fbid]: fbEvent }
            }));
            dispatch(removeEntities({
              importedEvents: fbid
            }));
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
      name: fbEvent.name,
      description: fbEvent.description,
    });
    dispatch(dashboardApi(`/events/import-from-fb/${fbid}`, fetchConfig))
      .then(
        event => {
          dispatch({ type: IMPORT_EVENT_COMPLETE, fbid });
          dispatch(mergeEntities({
            importedEvents: { [fbid]: event }
          }));
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

    //---------------- TRAIN XD
    //dispatch(mergeEntities({
      //fbEvents: {
        //1: {
          //id: 1,
          //name: 'YEAH!'
        //},
        //2: {
          //id: 2,
          //name: 'Banane gratis'
        //}
      //},
      //importedEvents: {
        //3: {
          //id: 44444,
          //fbid: 3,
          //name: 'ITP!'
        //}
      //}
    //}));
    //dispatch({
      //paging: {},
      //type: LOAD_IMPORT_EVENTS_COMPLETE,
      //ids: [1,2,3]
    //});
    //return;
    //----------------

    // Error handler for the various http calls...
    // Both Laravel API and Facebook Graph API
    const handleError = response => dispatch({
      type: LOAD_IMPORT_EVENTS_FAILURE,
      error: response.error || response
    });

    // TODO: Maybe move in store!
    const fbPageId = 'cosafarealecco'; // Hardcoded with endless love...
    const importUrl = getState().importEvents.list.nextUrl || `/${fbPageId}/posts?fields=link`;

    dispatch(graphApi(importUrl))
      .then(response => {
        // List of ~~NEW~~ candidate facebook events ids to import
        const fbEventsIdsToImport = difference(
          uniq(grabFbEventsIdsFromLinks(response.data.map(property('link')))),
          getState().importEvents.ids
        );

        // Import response pagination stuff...
        const paging = response.paging || {};

        // No events posted by page... Import complete!
        if (fbEventsIdsToImport.length === 0) {
          dispatch({ paging, type: LOAD_IMPORT_EVENTS_COMPLETE, ids: [] });
          return;
        }

        dispatch(importedEventsByFbIds(fbEventsIdsToImport))
          .then(importedEvents => {
            const importedFbEventsIds = keys(importedEvents);
            const newFbEventsIds = difference(fbEventsIdsToImport, importedFbEventsIds);

            // No new events, all alredy imported, Import complete!
            if (newFbEventsIds.length === 0) {
              dispatch(mergeEntities({
                importedEvents
              }));
              dispatch({
                paging,
                type: LOAD_IMPORT_EVENTS_COMPLETE,
                ids: fbEventsIdsToImport
              });
              return;
            }

            dispatch(fbEventsByIds(newFbEventsIds))
              .then(fbEvents => {
                  const fbEventsIds = fbEventsIdsToImport.filter(fbid =>
                    importedEvents[fbid] || fbEvents[fbid]
                  );
                  // Finally can back to Itaca!
                  dispatch(mergeEntities({
                    fbEvents,
                    importedEvents
                  }));
                  dispatch({
                    paging,
                    type: LOAD_IMPORT_EVENTS_COMPLETE,
                    ids: fbEventsIds
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
