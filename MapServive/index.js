/**
 * openlayers的封装，唯一对外的文件，请不要在外部直接引入此文件夹下的其他文件
 * xl开头的属性和方法是对外使用的，方便以后如果更换地图
 * 如果更换地图，可以提供这些相应的方法和属性
 * 降低了和openlayers的耦合性
 * 请不要在外部直接openlayers的原生方法和属性，避免造成高耦合
 * 如果需要用到原生方法或属性，请在这里对应的文件中加入xl前缀方法或属性
 */
import ol from "openlayers";
import { MapFeaturePoint } from "./MapLayerPoint";
import { MapFeatureHeatmap } from "./MapLayerHeatmap";
import { MapLayerBasemap } from "./MapLayerBasemap";
import { MapFeaturePolygon } from "./MapLayerPolygon";
import { MapFeatureCircle } from './MapLayerCircle';
import { MapFeatureRectangle } from './MapLayerRectangle';
import { MapDraw } from './MapLayerDraw';
import {
  pointToMap,
  pointFromMap,
  MapLayerGroup,
  toArray,
} from "./MapCommon";
const Feature = ol.Feature;
const LayerHeatmap = ol.layer.Heatmap;
const LayerVector = ol.layer.Vector;
const SourceVector = ol.source.Vector;

class MapLayerHeadmap extends LayerHeatmap {
  constructor(options = {}) {
    super({
      blur: options.blur || 15,
      radius: options.radius || 10,
      weight: function(feature) {
        let item = feature.xlGetOriItemCopy();
        return item.weight || Math.random();
      },
    });
    if (options.features) {
      this.xlSetFeatures(options.features);
    }
  }
  xlGetSource() {
    let source = this.getSource();
    if ( !source ) {
      source = new SourceVector()
    }
    this.setSource(source);
    return source;
  }
  xlRemoveFeatures(features) {
    features = toArray(features);
    let source = this.getSource();
    features.forEach(ft => {
      source.removeFeature(ft);
    })
  }
  xlAddFeatures(features) {
    features = toArray(features);
    features = features.map(o => {
      if ( !(o instanceof Feature) ) {
        return new MapFeatureHeatmap({ oriItem: o });
      }
      return o;
    })
    let source = this.xlGetSource();
    source.addFeatures(features);
  }
  xlSetFeatures(features) {
    features = toArray(features);
    let source = this.xlGetSource();
    source.clear();
    this.xlAddFeatures(features);
    return this;
  }
}
class MapLayerVector extends LayerVector {
  constructor(options = {}) {
    super();
    if (options.features) {
      this.xlSetFeatures(options.features);
    }
  }
  xlGetSource() {
    let source = this.getSource();
    if ( !source ) {
      source = new SourceVector()
    }
    this.setSource(source);
    return source;
  }
  xlRemoveFeatures(features) {
    features = toArray(features);
    let source = this.getSource();
    features.forEach(ft => {
      source.removeFeature(ft);
    })
  }
  xlAddFeatures(features) {
    features = toArray(features);
    features = features.map(o => {
      if ( !(o instanceof Feature) ) {
        if ( o.type === 'polygon' ) {
          return new MapFeaturePolygon({ oriItem: o });
        } else if ( o.type === 'circle' ) {
          return new MapFeatureCircle({ oriItem: o });
        } else if ( o.type === 'rectangle' ) {
          return new MapFeatureRectangle({ oriItem: o });
        } else if ( o.type === 'point' ) {
          return new MapFeaturePoint({ oriItem: o });
        }
      }
      return o;
    })
    let source = this.xlGetSource();
    source.addFeatures(features);
  }
  xlSetFeatures(features) {
    features = toArray(features);
    let source = this.xlGetSource();
    source.clear();
    this.xlAddFeatures(features);
    return this;
  }
}

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
      center: pointToMap(mapStatusObj.center),
      zoom: mapStatusObj.zoom,
    }),
  });
  map.on("moveend", function(evt) {
    let view = map.getView();
    let zoom = view.getZoom();
    let center = view.getCenter();

    center = pointFromMap(center);
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
