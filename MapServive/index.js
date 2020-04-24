import ol from "openlayers";
import { MapFeaturePoint } from "./MapLayerPoint";
import { MapFeatureHeatmap } from "./MapLayerHeatmap";
import { MapLayerBasemap } from "./MapLayerBasemap";
import { MapFeaturePolygon } from './MapLayerPolygon'
import { fromLonLat, MapLayerGroup, 
  MapLayerHeadmap,
  MapLayerVector } from "./MapCommon";

const Map = ol.Map;
const View = ol.View;
const LayerHeatmap = ol.layer.Heatmap;
const LayerVector = ol.layer.Vector;
const SourceVector = ol.source.Vector;

const mapLayerBasemapCls = new MapLayerBasemap();

function createMap(target) {
  let mapStatusObj = JSON.parse(localStorage.getItem('mapStatusObj')) || {
    center: [104.41, 35.82],
    zoom: 4
  }
  const map = new Map({
    target,
    layers: [mapLayerBasemapCls.group],
    view: new View({
      center: fromLonLat(mapStatusObj.center),
      zoom: mapStatusObj.zoom,
    }),
  });
  map.on("moveend", function(evt) {
    let view = map.getView();
    let zoom = view.getZoom();
    let center = view.getCenter();

    center = ol.proj.transform(
      center,
      "EPSG:3857",
      "EPSG:4326"
    );
    localStorage.setItem('mapStatusObj', JSON.stringify({
      center,
      zoom
    }))
  })
  map.on("singleclick", function(evt) {
    console.log(evt);
    let arr = [];
    map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      arr.push(feature);
      // layerTileGroupCls.group.setLayers(new Collection())
    });
    console.log(arr);
  });
  return map;
}



export function heatmapLayer(features) {
  features = features.map((o) => new MapFeatureHeatmap({ oriItem: o }))
  let layer = new MapLayerHeadmap({
    features
  });
  return layer;
}

export function pointLayer(features) {
  features = features.map((o) => new MapFeaturePoint({ oriItem: o }).feature)
  let layer = new MapLayerVector({
    features
  });
  return layer;
}

export function polygonLayer(features) {
  features = features.map((o) => new MapFeaturePolygon({ oriItem: o }).feature)
  let layer = new MapLayerVector({
    features
  });
  return layer;
}

export {
  createMap,
  fromLonLat,
  MapLayerBasemap,
  MapLayerGroup,
  MapFeaturePoint
};
