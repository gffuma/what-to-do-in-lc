import { createSelector } from 'reselect';
import { mapKeys, truncate, defaults } from 'lodash';

const getFbEventsEntity = (state) => state.entities.fbEvents;
const getImportedEventsEntity = (state) => state.entities.importedEvents;
const getCategoriesEntity = (state) => state.entities.categories;

const getImportEventsState = (state, props) =>
  state.importEvents[props.params.fbSourceId] || {};

const getImportEventsListState = (state, props) =>
  getImportEventsState(state, props).list || {};

const getImportEventsIds = (state, props) =>
  getImportEventsListState(state, props).ids || [];

const getImportEventsFilters = (state, props) =>
  getImportEventsState(state, props).filters || {};

const getImportEventsUIActions = (state, props) =>
  getImportEventsState(state, props).ui || {};

const getCategoriesIds = (state) => state.categories.list.ids;

// General UI Stuff loading, filters ecc
export const makeGetImportEventsUI = () => {
  return createSelector(
    [ getImportEventsListState, getImportEventsFilters ],
    (list, filters) => ({
      ...list,
      canLoadMoreEvents: !!list.nextUrl,
      filters: defaults(filters, {
        showAlredyImportedEvents: false,
      })
    })
  );
};

const makeGetImportEventsList = () => {
  return createSelector(
    [ getImportEventsIds, getFbEventsEntity, getImportedEventsEntity ],
    (importedEventsIds, fbEventsEntity, importedEventsEntity) => (
      importedEventsIds.map(fbid => importedEventsEntity[fbid] || fbEventsEntity[fbid])
    )
  );
};

export const makeCountAlredyImportedEvents = () => {
  const getImportEventsList = makeGetImportEventsList();

  return createSelector(
    [ getImportEventsList ],
    (events) => events.filter(event => event.id).length
  );
};

export const makeGetEvents = () => {
  // Start the odissea, go easy no side effects here λ

  const getImportEventsList = makeGetImportEventsList();

  const getImportEventsFiltered = createSelector(
    [ getImportEventsList, getImportEventsFilters ],
    (events, filters) => events.filter(event => (
      filters.showAlredyImportedEvents || !event.id
    ))
  );

  const getImporEventsWithCategories = createSelector(
    [ getImportEventsFiltered, getCategoriesIds, getCategoriesEntity ],
    (events, categoriesIds, cateogriesEntity) => events.map(event => {
      const categories = categoriesIds.map(categoryId => ({
        ...cateogriesEntity[categoryId],
        imported: event.categories.indexOf(categoryId) !== -1
      }));
      return {
        ...event,
        categories
      };
    })
  );

  const getImportEventsWithUIActions = createSelector(
    [ getImporEventsWithCategories, getImportEventsUIActions ],
    (events, ui) => events.map(event => {
      const e = { ...event };

      e.ui = defaults({
        importing: ui.importing[e.fbid],
        deleting: ui.deleting[e.fbid],
        resync: ui.resync[e.fbid],
        savingCategories: ui.savingCategories[e.fbid],
        showFullDescription: ui.showFullDescription[e.fbid],
      }, {
        importing: false,
        deleting: false,
        resync: false,
        savingCategories: false,
        showFullDescription: false,
      });

      e.ui.hasLongDescription = e.description && e.description.length > 250;
      e.ui.saving = e.ui.importing || e.ui.deleting || e.ui.resync || e.ui.savingCategories;

      // Truncate description when is too long and cannot want to is it full
      if (e.ui.hasLongDescription && !e.ui.showFullDescription) {
        e.description = truncate(e.description, { 'length': 250 });
      }

      return e;
    })
  );

  return getImportEventsWithUIActions;
};
