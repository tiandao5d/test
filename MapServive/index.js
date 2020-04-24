import ol from "openlayers";
import { MapLayerPoint } from "./MapLayerPoint";
import { MapLayerHeatmap } from "./MapLayerHeatmap";
import { MapLayerBasemap } from "./MapLayerBasemap";
import { MapLayerPolygon } from './MapLayerPolygon'
import { fromLonLat, MapLayerGroup } from "./MapCommon";

const Map = ol.Map;
const View = ol.View;

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

export {
  createMap,
  fromLonLat,
  MapLayerPoint,
  MapLayerHeatmap,
  MapLayerBasemap,
  MapLayerPolygon,
  MapLayerGroup,
};
