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
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-23.94, 52.58],
            [-14.31, 48.84],
            [-16.59, 55.08],
            [-23.94, 52.58]
          ]
        ]
      }
    }
  ]
};

export const deck = new Deck({
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
});

deck.setProps({layers : getLayers(myFeatureCollection, 'view')})

function getLayers(features, mode) {

    console.log(myFeatureCollection);

    var editableLayer = new EditableGeoJsonLayer({
        id: 'nebula',
        data: features,
        selectedFeatureIndexes : [features.features.length - 1],
        mode: mode,
        onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
            console.log(editType)
            if (editType!=='addTentativePosition') {
            myFeatureCollection = updatedData;
            deck.setProps({layers : getLayers(myFeatureCollection, 'view')})
            }
        },
      });

    var baseLayer = new GeoJsonLayer({
        id: 'base-map',
        data: COUNTRIES,
        // Styles
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        opacity: 0.4,
        getLineColor: [60, 60, 60],
        getFillColor: [200, 200, 200]
      });

    return [
        baseLayer,
        editableLayer,
    ]
}

window.addEventListener("keydown", function (event) {

  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key.toUpperCase()) {
    case "C":
        deck.setProps({layers : getLayers(myFeatureCollection, 'drawCircleFromCenter')})
        break;
    case "X":
        deck.setProps({layers : getLayers(myFeatureCollection, 'extrude')})
        break;
    case "E":
        deck.setProps({layers : getLayers(myFeatureCollection, 'elevation')})
        break;
    case "V":
        deck.setProps({layers : getLayers(myFeatureCollection, 'view')})
        break;
    case "D":
        deck.setProps({layers : getLayers(myFeatureCollection, 'drawPolygon')})
        break;
    case "M":
        deck.setProps({layers : getLayers(myFeatureCollection, 'modify')})
      break;
    default:
      return;
  }

  event.preventDefault();
}, true);

// For automated test cases
/* global document */
document.body.style.margin = '0px';

