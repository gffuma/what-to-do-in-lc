import React, { Component } from 'react'
import { connect } from 'react-redux';

class HomePage extends Component {
  render() {
    const { user } = this.props;

    return (
      <div>
        λ no si effects for {user.name}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(HomePage);
