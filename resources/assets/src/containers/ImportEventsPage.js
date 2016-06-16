import React from 'react';
import { connect } from 'react-redux';
import { loadImportEvents } from '../actions/importEvents';
import ImportEvents from '../components/ImportEvents';
import { mapKeys } from 'lodash';

function loadData(props) {
  // TODO: Shitty name chage to loadImportEvents or listImportEvents
  props.loadImportEvents();
}

class ImportEventsPage extends React.Component {

  componentWillMount() {
    loadData(this.props);
  }

  render() {
    const { events } = this.props;

    return <div>
      <ImportEvents events={events} />
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
  const { entities, importEvents } = state;

  const events = importEvents.ids.map(fbid => {
    const event = entities.importedEvents[fbid] ||
      mapKeys(entities.fbEvents[fbid], (v, k) => k === 'id' ? 'fbid' : k);
    return event;
  });

  console.log(events)

  return { events };
}

export default connect(mapStateToProps, {
  loadImportEvents,
})(ImportEventsPage);
