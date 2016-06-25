import React, { Component } from 'react';

export default class Categories extends Component {
  render() {
    return (
    <div>
      <div className="panel panel-default">


  <div className="panel-heading">8 Categorie</div>
  <ul className="list-group">
    <li className="list-group-item">/punk</li>
    <li className="list-group-item">
      <div className="row">
        <div className="col-md-10">
          <div>Punk e Birra</div>
          <div><span className="label label-primary">_rave</span></div>

        </div>
        <div className="col-md-2">
<button type="button" className="btn btn-warning btn-xs">
  <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit
</button>

<button type="button" className="btn btn-danger btn-xs">
  <span className="glyphicon glyphicon-remove-sign" aria-hidden="true"></span> Remove
</button>
        </div>
      </div>
    </li>
      <li className="list-group-item">Morbi leo risus</li>
      <li className="list-group-item">Porta ac consectetur ac</li>
      <li className="list-group-item">Vestibulum at eros</li>
    </ul>

      </div>
    </div>
    );
  }
}
