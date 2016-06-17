import React, { Component } from 'react'
import { connect } from 'react-redux';
import WaitForFacebookAcessToken from './WaitForFacebookAcessToken';
import Nav from '../components/Nav';

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
    //if (this.props.waitForFbAccessToken) {
      //return <WaitForFacebookAcessToken />;
    //}
    //return (
      //<div>
        //{this.props.children}
      //</div>
    //);
  }
}

function mapStateToProps(state) {
  const { token } = state.fb.access;
  return {
    waitForFbAccessToken: !token,
  };
}

export default connect(mapStateToProps)(App);
