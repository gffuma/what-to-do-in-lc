import React, { Component } from 'react'
import { Link } from 'react-router';
import activeComponent from 'react-router-active-component';

const NavLink = activeComponent('li');

export default class Nav extends Component {
  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">What to do in LC &#9889; Dashboard</Link>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <NavLink to="/import">Import</NavLink>
              <NavLink to="/categories">Categories</NavLink>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
