import React, { Component } from 'react'
import { connect } from 'react-redux';
import WaitForFacebookAcessToken from './WaitForFacebookAcessToken';

class App extends Component {
  render() {
    if (this.props.waitForFbAccessToken) {
      return <WaitForFacebookAcessToken />;
    }
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { token } = state.fb.access;
  return {
    waitForFbAccessToken: !token,
  };
}

export default connect(mapStateToProps)(App);
