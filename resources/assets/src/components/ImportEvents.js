import React, { Component } from 'react'

const fbEventUrl = fbid => `https://www.facebook.com/events/${fbid}`;

class EventItem extends Component {

  render() {
    const { event } = this.props;

    return (
      <div className={`event ${event.id ? 'imported' : ''}`}>
        <div className="event-name">{event.name}</div>
        <div className="event-fb-id">
          <a target="_blank" href={fbEventUrl(event.fbid)}>#{event.fbid}</a>
        </div>
      </div>
    );
  }
}

export default class ImportEvents extends Component {
  render() {
    const { events } = this.props;

    return (
      <div>
        <div className="events">
          {events.map(event => (
            <EventItem key={event.fbid} event={event} />
          ))}
        </div>
        <button type="button" className="btn btn-default btn-lg">
          <span className="glyphicon glyphicon-star" aria-hidden="true"></span> Star
        </button>
      </div>
    );
  }
}
