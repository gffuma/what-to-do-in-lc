import { createSelector } from 'reselect';
import { mapKeys, truncate, defaults } from 'lodash';

const getFbEventsEntity = (state) => state.entities.fbEvents;
const getImportedEventsEntity = (state) => state.entities.importedEvents;
const getImportEventsIds = (state) => state.importEvents.list.ids;

const getImportEventsList = createSelector(
  [ getImportEventsIds, getFbEventsEntity, getImportedEventsEntity ],
  (importedEventsIds, fbEventsEntity, importedEventsEntity) => (
    importedEventsIds.map(fbid => {
      return importedEventsEntity[fbid] ||
        mapKeys(fbEventsEntity[fbid], (v, k) => k === 'id' ? 'fbid' : k);
    })
  )
);

export const countAlredyImportedEvents = createSelector(
  [ getImportEventsList ],
  (events) => events.filter(event => event.id).length
);

const getImportEventsFilters = (state) => state.importEvents.filters;

const getImportEventsFiltered = createSelector(
  [ getImportEventsList, getImportEventsFilters ],
  (events, filters) => events.filter(event => (
    filters.showAlredyImportedEvents || !event.id
  ))
);

const getImportEventsUI = (state) => state.importEvents.ui;

export const getImportEvents = createSelector(
  [ getImportEventsFiltered, getImportEventsUI ],
  (events, ui) => events.map(event => {
    const e = { ...event };

    e.ui = defaults({
      importing: ui.importing[e.fbid],
      deleting: ui.deleting[e.fbid],
      showFullDescription: ui.showFullDescription[e.fbid],
    }, {
      importing: false,
      deleting: false,
      showFullDescription: false,
    });

    e.ui.hasLongDescription = e.description && e.description.length > 250;
    e.ui.saving = e.ui.importing || e.ui.deleting;

    // Truncate description when is too long and cannot want to is it full
    if (e.ui.hasLongDescription && !e.ui.showFullDescription) {
      e.description = truncate(e.description, { 'length': 250 });
    }

    return e;
  })
);
