import React from 'react';
import PropTypes from 'prop-types';

class AstronautAvatar extends React.Component {
  render() {
    return (
      <div className="astronaut">
        <img
          className="ui avatar image"
          src="astronaut-avatar.svg"
          alt="astronaut avatar"
        />
        <span>{this.props.person.name}</span>
      </div>
    );
  }
}

AstronautAvatar.propTypes = {
  person: PropTypes.objectOf(PropTypes.string)
};

export default AstronautAvatar;
