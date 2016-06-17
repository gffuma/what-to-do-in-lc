import React, { Component } from 'react'
import Spinner from './Spinner';

const fbEventUrl = fbid => `https://www.facebook.com/events/${fbid}`;

class EventItem extends Component {
  render() {
    const { event, importEvent } = this.props;

    return (
      <div className={`event ${event.id ? 'imported' : ''}`}>

        {!event.id && <button onClick={() => importEvent(event.fbid)}>Import</button>}

        <div className="event-name">{event.name}</div>
        <div className="event-fb-id">
          <a target="_blank" href={fbEventUrl(event.fbid)}>#{event.fbid}</a>
        </div>
      </div>
    );
  }
}

const LoadMoreEventsBtn = (props) => (
  <button type="button" className="btn btn-default btn-lg" onClick={() => props.onLoadMore()}>
    <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
    {' '}Load More
  </button>
);

export default class ImportEvents extends Component {
  render() {
    const { events, loading, canLoadMore, onLoadMore, importEvent } =  this.props;

    return (
      <div>
        <div className="events">
          {events.map(event => (
            <EventItem key={event.fbid} event={event} importEvent={importEvent} />
          ))}
        </div>
        {!loading && canLoadMore &&
          <div style={{textAlign:'center'}}>
            <LoadMoreEventsBtn onLoadMore={onLoadMore} />
          </div>}
        {loading && <Spinner />}
      </div>
    );
  }
}
