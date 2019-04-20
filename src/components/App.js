import React from 'react';
import axios from 'axios';
import OpenLayersMap from './OpenLayersMap';
import AstronautInfo from './AstronautInfo';
import StationInfo from './StationInfo';

class App extends React.Component {
  state = {
    coords: [],
    timestamp: undefined,
    astronauts: undefined
  };

  getAstronauts = async () => {
    const url = 'http://api.open-notify.org/astros.json';
    try {
      const data = await axios.get(url);
      this.setState({ astronauts: data.data });
    } catch (err) {
      this.setState({ astronauts: undefined });
    }
  };

  getLocation = async () => {
    const url = 'http://api.open-notify.org/iss-now.json';
    try {
      let res = await axios.get(url);
      const { latitude, longitude } = res.data.iss_position;
      const timestamp = res.data.timestamp;
      const coords = [parseFloat(longitude), parseFloat(latitude)];
      this.setState({
        coords: coords,
        timestamp: timestamp
      });
    } catch (err) {
      this.setState({
        coords: [],
        timestamp: undefined
      });
    }
  };

  componentDidMount() {
    this.getAstronauts();
    setInterval(() => {
      this.getAstronauts();
    }, 300000);

    this.getLocation();
    setInterval(() => {
      this.getLocation();
    }, 5000);
  }

  render() {
    return (
      <div className="ui container main">
        <AstronautInfo astronauts={this.state.astronauts} />
        <StationInfo
          coords={this.state.coords}
          timestamp={this.state.timestamp}
        />
        <OpenLayersMap coords={this.state.coords} />
        <p className="attribution">
          Data provided courtesy of{' '}
          <a href="http://open-notify.org/Open-Notify-API/ISS-Location-Now/">
            Open Notify.
          </a>{' '}
          Icons by{' '}
          <a href="https://www.flaticon.com/authors/srip" title="srip">
            srip
          </a>{' '}
          under{' '}
          <a
            href="http://creativecommons.org/licenses/by/3.0/"
            title="Creative Commons BY 3.0"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC 3.0 BY.
          </a>
        </p>
      </div>
    );
  }
}

export default App;
