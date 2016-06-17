import React from 'react';
import { connect } from 'react-redux';
import { loadImportEvents, importEvent } from '../actions/importEvents';
import ImportEvents from '../components/ImportEvents';
import { mapKeys } from 'lodash';

class ImportEventsPage extends React.Component {
  componentWillMount() {
    this.props.loadImportEvents();
  }

  render() {
    const { events, loading, nextUrl, importEvent } = this.props;

    return <div>
      <ImportEvents
        events={events}
        loading={loading}
        onLoadMore={() => this.props.loadImportEvents()}
        importEvent={importEvent}
        canLoadMore={!!nextUrl}  />
    </div>;

    return (
      <div>
        {events.map(e => (
          <div key={e.event.fbid || e.event.id} style={{ padding: '20px' }}>
            <div>{e.event.name}</div>
            <div>{e.event.fbid || e.event.id}</div>
            <div>{e.imported ? 'IMPORTATO!' : 'IMPORTA...'}</div>
          </div>
        ))}
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { entities, importEvents: { ids, loading, nextUrl } } = state;

  //return { events: [
    //{ fbid: null }
  //] }

  const events = ids.map(fbid => {
    const event = entities.importedEvents[fbid] ||
      mapKeys(entities.fbEvents[fbid], (v, k) => k === 'id' ? 'fbid' : k);
    return event;
  });

  return { events, loading, nextUrl };
}

export default connect(mapStateToProps, {
  loadImportEvents,
  importEvent,
})(ImportEventsPage);
