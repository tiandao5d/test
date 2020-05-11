/**
 * openlayers的封装，唯一对外的文件，请不要在外部直接引入此文件夹下的其他文件
 * xl开头的属性和方法是对外使用的，方便以后如果更换地图
 * _xl开头的属性和方法不对外使用请不要在外部使用，以免造成高耦合
 * 如果更换地图，可以提供这些相应的方法和属性
 * 降低了和openlayers的耦合性
 * 请不要在外部直接openlayers的原生方法和属性，避免造成高耦合
 * 如果需要用到原生方法或属性，请在这里对应的文件中加入xl前缀方法或属性
 */
import ol from "openlayers";
import { MapFeaturePoint } from "./MapLayerPoint";
import { MapFeatureHeatmap } from "./MapLayerHeatmap";
import { MapLayerBasemap, MapLayerGroup, MapLayerVector, MapLayerHeadmap } from "./MapLayerBase";
import { MapFeaturePolygon } from "./MapLayerPolygon";
import { MapDraw } from './MapLayerDraw';
import {
  xlPointToMap,
  xlPointFromMap,
} from "./MapCommon";
const Map = ol.Map;
const View = ol.View;
let map = null;

const mapLayerBasemapCls = new MapLayerBasemap();

function createMap(target) {
  let mapStatusObj = JSON.parse(localStorage.getItem("mapStatusObj")) || 
  {
    center: [104.41, 35.82],
    zoom: 4,
  };
  map = new Map({
    target,
    layers: [mapLayerBasemapCls],
    view: new View({
      center: xlPointToMap(mapStatusObj.center),
      zoom: mapStatusObj.zoom,
    }),
  });
  map.on("moveend", function(evt) {
    let view = map.getView();
    let zoom = view.getZoom();
    let center = view.getCenter();

    center = xlPointFromMap(center);
    localStorage.setItem(
      "mapStatusObj",
      JSON.stringify({
        center,
        zoom,
      })
    );
  });
  let selectedArr = [];
  map.on("singleclick", function(evt) {
    console.log(mapLayerBasemapCls.xlGetLayers());
    selectedArr.forEach(ft => {
      if ( ft.xlSetSelected ) {
        ft.xlSetSelected(false);
      }
      if ( ft.xlExitDraw ) {
        ft.xlExitDraw(map);
      }
    })
    selectedArr = [];
    map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      selectedArr.push(feature);
      if ( feature.xlSetSelected ) {
        feature.xlSetSelected();
      }
      if ( feature.xlEnterDraw ) {
        feature.xlEnterDraw(map);
      }
      // layerTileGroupCls.group.setLayers(new Collection())
    });
    console.log(selectedArr);
  });
  return map;
}
// 所有对外开放的类或函数
export {
  MapDraw,
  createMap,
  MapLayerGroup, // 图层组，可以对其中图层进行更改设置
  MapLayerBasemap, // 地图底图图层，提供多个可选地图底图，继承自图层组图层组
  MapLayerVector, // 基本图层可以加入point，polygon等feature
  MapLayerHeadmap, // 热点图图层
  MapFeaturePoint, // 点元素设置
  MapFeatureHeatmap, // 热点图元素
  MapFeaturePolygon, // 多边形元素
};
