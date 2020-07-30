import {Deck} from '@deck.gl/core';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import {EditableGeoJsonLayer, DrawPolygonMode} from '@nebula.gl/layers';

const COUNTRIES =  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson'; //eslint-disable-line
const AIR_PORTS = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
  bearing: 0,
  pitch: 30
};

var myFeatureCollection = {
  "type": "FeatureCollection",
  "features": [ ]
};

const layers = [
  new GeoJsonLayer({
    id: 'base-map',
    data: COUNTRIES,
    // Styles
    stroked: true,
    filled: true,
    lineWidthMinPixels: 2,
    opacity: 0.4,
    getLineColor: [60, 60, 60],
    getFillColor: [200, 200, 200]
  }),
  new GeoJsonLayer({
    id: 'airports',
    data: AIR_PORTS,
    // Styles
    filled: true,
    pointRadiusMinPixels: 2,
    pointRadiusScale: 2000,
    getRadius: f => 11 - f.properties.scalerank,
    getFillColor: [200, 0, 80, 180],
    // Interactive props
    pickable: true,
    autoHighlight: true,
    onClick: info =>
        // eslint-disable-next-line
        info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
  }),

  new EditableGeoJsonLayer({
    id: 'nebula',
    data: myFeatureCollection,
    selectedFeatureIndexes : [],
    mode: 'drawPolygon',
    onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {

      if (editType === 'addFeature') {

        myFeatureCollection = updatedData;

        layers.push(new GeoJsonLayer({

          id: 'extruded',
          data: updatedData.features,

          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 2000,
          extruded: true,
          getElevation: 1000000,
          getFillColor: [200, 0, 80, 180],

          // Interactive props
          pickable: true,
          autoHighlight: true,

        }));

        deck.setProps({layers : layers})
      }

    },
  }),
]

export const deck = new Deck({
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: layers
});

// For automated test cases
/* global document */
document.body.style.margin = '0px';
