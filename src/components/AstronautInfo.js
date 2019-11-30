import React from 'react';
import PropTypes from 'prop-types';
import AstronautAvatar from './AstronautAvatar';

class AstronautInfo extends React.Component {
  pluralizer(num) {
    return num === 1 ? 'is' : 'are';
  }

  getCrafts() {
    const people = Object.values(this.props.astronauts.people);
    const crafts = {};

    for (let i = 0; i < people.length; i++) {
      let craft = people[i].craft;
      crafts[craft] = crafts[craft] ? crafts[craft] + 1 : 1;
    }

    const craftArr = Object.keys(crafts);

    if (craftArr.length === 0) {
      return '.';
    }
    if (craftArr.length === 1) {
      return ` and all of them are aboard the ${craftArr[0]}.`;
    } else {
      let result = '';
      for (let i = 0; i < craftArr.length; i++) {
        let numInCraft = crafts[craftArr[i]];
        if (i === 0) {
          result += `. ${numInCraft} ${this.pluralizer(
            numInCraft
          )} aboard the ${craftArr[i]}`;
        } else if (i !== craftArr.length - 1) {
          result += `, ${numInCraft} ${this.pluralizer(
            numInCraft
          )} aboard the ${craftArr[i]}`;
        } else {
          result += `, and ${numInCraft} ${this.pluralizer(
            numInCraft
          )} aboard the ${craftArr[i]}.`;
        }
      }
      return result;
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.astronauts !== nextProps.astronauts;
  }

  render() {
    if (this.props.astronauts === null) {
      return (
        <div>
          <h1>Astronauts in Space</h1>
          <p></p>
          <ul className="astronauts"></ul>
        </div>
      );
    }

    if (this.props.astronauts) {
      const avatars = this.props.astronauts.people.map(person => (
        <AstronautAvatar person={person} key={person.name} />
      ));

      return (
        <div>
          <h1>Astronauts in Space</h1>
          <p>
            There are currently <strong>{this.props.astronauts.number}</strong>{' '}
            astronauts in space{this.getCrafts()}
          </p>
          <ul className="astronauts">{avatars}</ul>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Astronauts in Space</h1>
          <p className="astronauts">
            <i className="exclamation triangle icon" />
            Unable to get current astronauts.
          </p>
        </div>
      );
    }
  }
}

AstronautInfo.propTypes = {
  astronauts: PropTypes.object
};

export default AstronautInfo;
