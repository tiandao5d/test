import ol from "openlayers";
import { MapLayerPoint } from "./MapLayerPoint";
import { MapLayerHeatmap } from "./MapLayerHeatmap";
import { MapLayerBasemap } from "./MapLayerBasemap";
import { fromLonLat, MapLayerGroup } from "./MapCommon";

const Map = ol.Map;
const View = ol.View;

const mapLayerBasemapCls = new MapLayerBasemap();

function createMap(target) {
  const map = new Map({
    target,
    layers: [mapLayerBasemapCls.group],
    view: new View({
      center: fromLonLat([104.41, 35.82]),
      zoom: 4,
    }),
  });
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
  MapLayerPoint,
  MapLayerHeatmap,
  MapLayerBasemap,
  fromLonLat,
  MapLayerGroup,
};
