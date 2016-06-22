import React from 'react';
import { connect } from 'react-redux';
import ImportEvents from '../components/ImportEvents';
import {
  getImportEvents,
  countAlredyImportedEvents
} from '../selectors/importEvents';
import {
  loadImportEvents,
  importEvent,
  deleteImportedEvent,
  reSyncImportedEvent,
  showFullDescription,
  showLessDescription,
  showAlredyImportedEvents,
  hideAlredyImportedEvents
} from '../actions/importEvents';

class ImportEventsPage extends React.Component {
  componentWillMount() {
    this.props.loadImportEvents();
  }

  render() {
    const {
      events,
      alredyImportedCount,
      loading,
      canLoadMoreEvents,
      importEvent,
      reSyncImportedEvent,
      deleteImportedEvent,
      loadImportEvents,
      showFullDescription,
      showLessDescription,
      showAlredyImportedEvents,
      hideAlredyImportedEvents,
      filters
    } = this.props;

    return (
      <ImportEvents
        events={events}
        alredyImportedCount={alredyImportedCount}
        loading={loading}
        canLoadMoreEvents={canLoadMoreEvents}
        showAlredyImportedEvents={filters.showAlredyImportedEvents}
        onLoadMoreEvents={loadImportEvents}
        onEventImported={importEvent}
        onEventResync={reSyncImportedEvent}
        onEventDeleted={deleteImportedEvent}
        onShowFullDescription={showFullDescription}
        onShowLessDescription={showLessDescription}
        onShowAlredyImportedEvents={showAlredyImportedEvents}
        onHideAlredyImportedEvents={hideAlredyImportedEvents}
      />
    );
  }

}

function mapStateToProps(state) {
  const { filters } = state.importEvents;
  const { loading, nextUrl } = state.importEvents.list;

  return {
    events: getImportEvents(state),
    alredyImportedCount: countAlredyImportedEvents(state) ,
    canLoadMoreEvents: !!nextUrl,
    loading,
    filters,
  };
}

export default connect(mapStateToProps, {
  loadImportEvents,
  importEvent,
  reSyncImportedEvent,
  deleteImportedEvent,
  showFullDescription,
  showLessDescription,
  showAlredyImportedEvents,
  hideAlredyImportedEvents,
})(ImportEventsPage);
