import React from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';

class OpenLayersMap extends React.Component {
  state = {
    map: {},
    receiving: false,
    curLineLayer: 2
  };

  updatePoint(coords) {
    const mapLayers = this.state.map.getLayers();
    const pointLayer = mapLayers.item(1);
    const point = pointLayer
      .getSource()
      .getFeatures()[0]
      .getGeometry();
    point.setCoordinates(coords);
  }

  updateLine(coords, curLineLayer) {
    const mapLayers = this.state.map.getLayers();
    const lineLayer = mapLayers.item(curLineLayer);
    const lineString = lineLayer
      .getSource()
      .getFeatures()[0]
      .getGeometry();
    lineString.appendCoordinate(coords);
  }

  addPoint(coords) {
    const feature = new Feature({
      geometry: new Point(coords),
      name: 'Point'
    });
    const pointStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: 'rgb(116, 68, 172)' })
      }),
      zIndex: 3
    });
    const source = new VectorSource({
      features: [feature]
    });
    const vector = new VectorLayer({
      source: source,
      style: [pointStyle],
      zIndex: 3
    });

    this.state.map.addLayer(vector);
  }

  addLine(coords) {
    const lineString = new LineString(coords);
    lineString.transform('EPSG:4326', 'EPSG:3857');

    const feature = new Feature({
      geometry: lineString,
      name: 'Line'
    });
    const lineStyle = new Style({
      stroke: new Stroke({
        color: 'rgb(116, 68, 172, .33)',
        width: 10
      }),
      zIndex: 2
    });
    const source = new VectorSource({
      features: [feature]
    });
    const vector = new VectorLayer({
      source: source,
      style: [lineStyle],
      zIndex: 2
    });

    this.state.map.addLayer(vector);
  }

  hasWrapped(coords, curLineLayer) {
    // If the current coordinate jumps more than half-way accross the map
    // from the previous coordinate this will be considered a wrap
    const mapLayers = this.state.map.getLayers();
    const lineLayer = mapLayers.item(curLineLayer);
    const lineString = lineLayer
      .getSource()
      .getFeatures()[0]
      .getGeometry();
    const lineCoords = lineString.flatCoordinates;

    const wrapXMax =
      lineCoords[lineCoords.length - 2] > 9000000 && coords[0] < -9000000;
    const wrapXMin =
      lineCoords[lineCoords.length - 2] < -9000000 && coords[0] > 9000000;
    const wrapYMax =
      lineCoords[lineCoords.length - 1] > 4500000 && coords[1] < -4500000;
    const wrapYMin =
      lineCoords[lineCoords.length - 1] < -4500000 && coords[1] > 4500000;

    if (wrapXMax || wrapXMin || wrapYMax || wrapYMin) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const coords = fromLonLat(this.props.coords);
    let curLineLayer = this.state.curLineLayer;

    if (coords[0] && coords[1]) {
      if (!this.state.receiving) {
        this.addPoint(coords);
        this.addLine([]);
        this.setState({ receiving: true });
        this.state.map.getView().setCenter(coords);
      } else {
        if (this.hasWrapped(coords, curLineLayer)) {
          this.addLine([]);
          curLineLayer += 1;
          this.setState({ curLineLayer: curLineLayer });
        }
        this.updatePoint(coords);
        this.updateLine(coords, curLineLayer);
      }
    }
  }

  componentDidMount() {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM({})
        })
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2
      }),
      controls: []
    });

    this.setState({ map: map });
  }

  render() {
    return <div id="map" className="map" />;
  }
}

OpenLayersMap.propTypes = {
  coords: PropTypes.arrayOf(PropTypes.number)
};

export default OpenLayersMap;
