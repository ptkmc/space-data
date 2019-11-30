import React from 'react';
import PropTypes from 'prop-types';

class StationInfo extends React.Component {
  render() {
    if (this.props.coords === [] || this.props.timestamp === null) {
      return (
        <div>
          <h1>Current Location of the ISS</h1>
          <div className="location-info">
            <p></p>
          </div>
        </div>
      );
    }

    if (this.props.coords !== [] && this.props.timestamp) {
      const coordStr = `${this.props.coords[1]}, ${this.props.coords[0]}`;
      const timestamp = new Date(
        parseInt(this.props.timestamp + '000')
      ).toLocaleTimeString();

      return (
        <div>
          <h1>Current Location of the ISS</h1>
          <div className="location-info">
            <p className="coords">{coordStr}</p>
            <p>{timestamp}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Current Location of the ISS</h1>
          <div className="location-info">
            <p>
              <i className="exclamation triangle icon" />
              Unable to get current location. Retrying in 5 seconds...
            </p>
          </div>
        </div>
      );
    }
  }
}

StationInfo.propTypes = {
  coords: PropTypes.arrayOf(PropTypes.number),
  timestamp: PropTypes.number
};

export default StationInfo;
