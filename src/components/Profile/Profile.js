import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Profile extends Component {

    render() {
        return (
            <div className="profile">
                <h2>Username: {this.props.reduxState.user.username}</h2>
                <p>Email: {this.props.reduxState.user.email}</p>
            </div>
        );
    }
}

const mapStateToProps = reduxState => ({
    reduxState,
});

export default connect(mapStateToProps)(Profile);