import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImportEvents from '../components/ImportEvents';
import { Link } from 'react-router';
import { mapValues, partial } from 'lodash';
import {
  makeGetEvents,
  makeCountAlredyImportedEvents,
  makeGetImportEventsUI
} from '../selectors/importEvents';
import {
  loadImportEvents,
  loadImportEventsFirstTime,
  importEvent,
  deleteImportedEvent,
  reSyncImportedEvent,
  showFullDescription,
  showLessDescription,
  showAlredyImportedEvents,
  hideAlredyImportedEvents,
  addCategoryToEvent,
  removeCategoryFromEvent
} from '../actions/importEvents';
import {
  loadCategories
} from '../actions/categories';

function loadData(props) {
  props.loadCategories();
  props.loadImportEventsFirstTime();
}

class ImportEventsPage extends React.Component {
  componentWillMount() {
    loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.fbSourceId !== this.props.params.fbSourceId) {
      loadData(nextProps);
    }
  }

  render() {
    const {
      events,
      loading,
      filters,
      receivedAt,
      canLoadMoreEvents,
      alredyImportedCount,
      loadImportEvents,
      importEvent,
      reSyncImportedEvent,
      deleteImportedEvent,
      showFullDescription,
      showLessDescription,
      showAlredyImportedEvents,
      hideAlredyImportedEvents,
      addCategoryToEvent,
      removeCategoryFromEvent,
    } = this.props;

    return (
      <ImportEvents
        events={events}
        loading={loading}
        filters={filters}
        receivedAt={receivedAt}
        canLoadMoreEvents={canLoadMoreEvents}
        alredyImportedCount={alredyImportedCount}
        onLoadMoreEvents={loadImportEvents}
        onEventImported={importEvent}
        onEventResync={reSyncImportedEvent}
        onEventDeleted={deleteImportedEvent}
        onShowFullDescription={showFullDescription}
        onShowLessDescription={showLessDescription}
        onShowAlredyImportedEvents={showAlredyImportedEvents}
        onHideAlredyImportedEvents={hideAlredyImportedEvents}
        onCategoryAdded={addCategoryToEvent}
        onCategoryRemoved={removeCategoryFromEvent}
      />
    );
  }
}

const makeMapStateToProps = () => {
  const getEvents = makeGetEvents();
  const countAlredyImportedEvents = makeCountAlredyImportedEvents();
  const getImportEventsUI = makeGetImportEventsUI();

  const mapStateToProps = (state, props) => ({
    ...getImportEventsUI(state, props),
    events: getEvents(state, props),
    alredyImportedCount: countAlredyImportedEvents(state, props),
  });
  return mapStateToProps;
};

function mapDispatchToProps(dispatch, ownProps) {
  const fbSourceId  = ownProps.params.fbSourceId;

  const curryFbSourceId = actionCreators =>
    mapValues(actionCreators, fn => partial(fn, fbSourceId));

  const bindActionCreatorsWithFbSourceId = actionCreators =>
    bindActionCreators(curryFbSourceId(actionCreators), dispatch);

  return {
    ...bindActionCreatorsWithFbSourceId({
      loadImportEvents,
      loadImportEventsFirstTime,
      importEvent,
      reSyncImportedEvent,
      deleteImportedEvent,
      showFullDescription,
      showLessDescription,
      showAlredyImportedEvents,
      hideAlredyImportedEvents,
      loadCategories,
      addCategoryToEvent,
      removeCategoryFromEvent,
    }),
    loadCategories: () => dispatch(loadCategories()),
  };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ImportEventsPage);
