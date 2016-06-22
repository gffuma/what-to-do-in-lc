import React, { Component } from 'react'
import classNames from 'classnames';
import moment from 'moment';
import Spinner from './Spinner';

const fbEventUrl = fbid => `https://www.facebook.com/events/${fbid}`;

class EventItem extends Component {
  render() {
    const {
      event,
      onEventImported,
      onEventDeleted,
      onEventResync,
      onShowFullDescription,
      onShowLessDescription
    } = this.props;
    const {
      ui: {
        deleting,
        saving,
        importing,
        hasLongDescription,
        showFullDescription,
      }
    } = event;
    const imported = !!event.id;
    const eventClass = classNames('list-group-item event', {
      imported,
      saving,
      deleting,
      importing,
    });

    return (
      <div className={eventClass}>

        <div className="event-header">
          <div className="event-name pull-left">{event.name}</div>
          {!imported && (
            <div className="event-actions pull-right">
              <button
                type="button"
                className="btn btn-success btn-xs"
                onClick={() => onEventImported(event.fbid)}>
                <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                {' '}Import
              </button>
            </div>
          )}
          {imported && (
            <div className="event-actions pull-right">
              {false && <button
                type="button"
                className="btn btn-warning btn-xs">
                <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                {' '}Edit
              </button>}
              <button
                type="button"
                onClick={() => onEventResync(event.fbid)}
                className="btn btn-primary btn-xs">
                <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                {' '}Re-Sync
              </button>
              <button
                type="button"
                className="btn btn-danger btn-xs"
                onClick={() => onEventDeleted(event.fbid)}>
                <span className="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
                {' '}Remove
              </button>
            </div>
          )}
          <div className="clearfix"/>
          {event.fbCoverImageUrl && (
            <div className="event-image">
              <img src={event.fbCoverImageUrl} style={{ maxHeight: 100 }} className="img-thumbnail" />
            </div>
          )}
          <div className="event-fb-id">
            <a target="_blank" href={fbEventUrl(event.fbid)}>#{event.fbid}</a>
          </div>
          <div className="event-small-info">
            <div>
              <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
              {' '}{event.placeName} {event.city} {event.street} {event.zip} {event.country}{' '}
            </div>
            <div>
              <span className="glyphicon glyphicon-time" aria-hidden="true"></span>
              {' '}
              {moment(event.startTime).format('dddd M MMMM HH:mm')}
              {event.endTime && <span>{' - '}{moment(event.endTime).format('dddd M MMMM HH:mm')}</span>}
            </div>
            <span>
              <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
              {' '}{event.fbAttendingCount}{' '}
            </span>
          </div>
        </div>

        <div className="event-body">
          <div className="event-description">{event.description}</div>
          {(hasLongDescription && !showFullDescription) &&
            <div
              onClick={() => onShowFullDescription(event.fbid)}
              className="show-description">
              <a>Show more...</a>
            </div>}

          {(hasLongDescription && showFullDescription) &&
            <div
              onClick={() => onShowLessDescription(event.fbid)}
              className="show-description">
              <a>Show less...</a>
            </div>}
        </div>

      </div>
    );
  }
}

const LoadMoreEventsBtn = (props) => (
  <button type="button" className="btn btn-default btn-lg" onClick={() => props.onLoadMoreEvents()}>
    <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
    {' '}Load More
  </button>
);

class ImportEventsControllers extends Component {

  render() {
    const {
      showAlredyImportedEvents,
      alredyImportedCount,
      onShowAlredyImportedEvents,
      onHideAlredyImportedEvents
    } = this.props;

    return (
      <div className="panel panel-default">
        <div className="panel-heading"><span className="glyphicon glyphicon-console" aria-hidden="true"></span></div>
        <div className="panel-body">
          <label>
            <input type="checkbox" checked={showAlredyImportedEvents} onChange={(e) => {
              showAlredyImportedEvents ? onHideAlredyImportedEvents() : onShowAlredyImportedEvents()
            }} /> Show Alredy Imported Events ({alredyImportedCount})
          </label>
        </div>
      </div>
    );
  }
}

export default class ImportEvents extends Component {
  render() {
    const {
      events,
      alredyImportedCount,
      loading,
      canLoadMoreEvents,
      onLoadMoreEvents,
      showAlredyImportedEvents,
      onEventImported,
      onEventResync,
      onEventDeleted,
      onShowFullDescription,
      onShowLessDescription,
      onShowAlredyImportedEvents,
      onHideAlredyImportedEvents
    } =  this.props;

    return (
      <div>
        <ImportEventsControllers
          alredyImportedCount={alredyImportedCount}
          showAlredyImportedEvents={showAlredyImportedEvents}
          onShowAlredyImportedEvents={onShowAlredyImportedEvents}
          onHideAlredyImportedEvents={onHideAlredyImportedEvents}
        />
        <div className="list-group events">
          {events.map(event => (
            <EventItem
              key={event.fbid}
              event={event}
              onShowFullDescription={onShowFullDescription}
              onShowLessDescription={onShowLessDescription}
              onEventDeleted={onEventDeleted}
              onEventResync={onEventResync}
              onEventImported={onEventImported}
            />
          ))}
        </div>
        {!loading && canLoadMoreEvents &&
          <div style={{textAlign:'center'}}>
            <LoadMoreEventsBtn onLoadMoreEvents={onLoadMoreEvents} />
          </div>}
        {loading && <Spinner />}
      </div>
    );
  }
}
