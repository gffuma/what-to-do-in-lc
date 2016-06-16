import { graphApi } from './fb';
import { dashboardApi } from './laravel';
import { property, keys, difference, concat, uniq } from 'lodash';
import { mergeEntities } from './entities';
import {
  LOAD_IMPORT_EVENTS_START,
  LOAD_IMPORT_EVENTS_COMPLETE,
  LOAD_IMPORT_EVENTS_FAILURE
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
  dispatch(graphApi(`/?ids=${fbids.join(',')}`))

const importedEventsByFbIds = (fbids) => (dispatch, getState) =>
  dispatch(dashboardApi(`/events/by-fb-ids/${fbids.join(',')}`));

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

    const fbPageId = 'cosafarealecco'; // Hardcoded with endless love...
    const importUrl = getState().importEvents.nextUrl || `/${fbPageId}/posts?fields=link`;

    // TODO: Remove from events ids the ids alredy in the store!!!!!!
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
              dispatch({
                paging,
                type: LOAD_IMPORT_EVENTS_COMPLETE,
                ids: importedFbEventsIds
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
