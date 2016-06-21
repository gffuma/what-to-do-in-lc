import React, { Component } from 'react'
import classNames from 'classnames';
import Spinner from './Spinner';

const fbEventUrl = fbid => `https://www.facebook.com/events/${fbid}`;

class EventItem extends Component {
  render() {
    const {
      event,
      onEventImported,
      onEventDeleted,
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
          <div className="event-actions pull-right">
            {!imported && (
              <button
                type="button"
                className="btn btn-success btn-xs"
                onClick={() => onEventImported(event.fbid)}>
                <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                {' '}Import
              </button>
            )}
            {imported && (
              <button
                type="button"
                className="btn btn-danger btn-xs"
                onClick={() => onEventDeleted(event.fbid)}>
                <span className="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
                {' '}Remove
              </button>
            )}
          </div>
          <div className="clearfix"/>
          <div className="event-fb-id">
            <a target="_blank" href={fbEventUrl(event.fbid)}>#{event.fbid}</a>
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
