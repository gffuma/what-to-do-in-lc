import React, { Component } from 'react'
import { connect } from 'react-redux';
import { obtainAcessToken } from '../actions/fb';

class WaitForFacebookAcessToken extends Component {

  render() {
    const {
      token,
      obtaining,
      error,
      retryObtainingAccessToken
    } = this.props;

    // Nothing to wait for...
    if (token) {
      return null;
    }

    if (obtaining) {
      return <div>Just grabbing access token for YOU!</div>;
    }

    if (error) {
      return (
        <div>
          <div>Arrr was an error {error.message}</div>
          <button type="button" onClick={() => retryObtainingAccessToken()}>Retry now!</button>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return state.fb.access;
}

export default connect(mapStateToProps, {
  retryObtainingAccessToken: obtainAcessToken,
})(WaitForFacebookAcessToken);
