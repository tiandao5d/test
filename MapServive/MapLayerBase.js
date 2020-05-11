import ol from "openlayers";
import { xlToArray } from "./MapCommon";
import { MapFeatureCircle } from "./MapFeatureCircle";
import { MapFeatureRectangle } from "./MapFeatureRectangle";
import { MapFeaturePoint } from "./MapFeaturePoint";
import { MapFeatureHeatmap } from "./MapFeatureHeatmap";
import { MapFeaturePolygon } from "./MapFeaturePolygon";
const Collection = ol.Collection;
const LayerGroup = ol.layer.Group;
const Feature = ol.Feature;
const LayerHeatmap = ol.layer.Heatmap;
const LayerVector = ol.layer.Vector;
const SourceVector = ol.source.Vector;

const SourceOSM = ol.source.OSM;
const SourceXYZ = ol.source.XYZ;
const LayerTile = ol.layer.Tile;

// 图层组
class MapLayerGroup extends LayerGroup {
  xlClear() {
    this.xlGetLayers([]);
    return this;
  }
  // 设置图层组中的图层，
  // 参数可以是一个包含图层的数组，也可以是一个单独的图层
  xlSetLayers(layers) {
    if (!Array.isArray(layers)) {
      layers = [layers];
    }
    this.setLayers(new Collection(layers));
    return this;
  }
  // 获取当前图层组中的图层
  xlGetLayers() {
    return this.getLayers().getArray();
  }
}

// 可用底图
let _xlBasemap = {
  xlGetOSM() {
    return new LayerTile({
      source: new SourceOSM(),
    });
  },
  xlGetGoogle() {
    return new LayerTile({
      title: "google street",
      coordSys: "gww",
      type: "base",
      source: new SourceXYZ({
        url:
          "https://mt2.google.cn/maps/vt?lyrs=m&hl=en-US&gl=CN&&x={x}&y={y}&z={z}",
        crossOrigin: "anonymous",
      }),
    });
  },
};

// 底图图层
class MapLayerBasemap extends MapLayerGroup {
  constructor() {
    super();
    this.xlOriItems = this.xlGetOriItems();
    this.xlSwitchItem(this.xlOriItems[0]);
  }
  // 切换图层
  xlSwitchItem(item) {
    let k = typeof item === "string" ? item : item.id;
    let layer = _xlBasemap[k]();
    this.xlSetLayers(layer);
  }
  // 用于界面用户可切换图层的数据
  xlGetOriItems() {
    return [
      { id: "xlGetOSM", title: "osm" },
      { id: "xlGetGoogle", title: "google" },
    ];
  }
}

//清空图层元素
function _xlLayerClear(layer) {
  let source = _xlLayerGetSource(layer);
  source.clear();
  return layer;
}

// 给图层添加source，that为图层实例
function _xlLayerGetSource(layer) {
  let source = layer.getSource();
  if (!source) {
    source = new SourceVector();
    layer.setSource(source);
  }
  return source;
}
// 删除图层元素feature，features可以是数组可以是单个feature
function _xlLayerRemoveFeatures(features, layer) {
  features = xlToArray(features);
  let source = layer.getSource();
  features.forEach((ft) => {
    source.removeFeature(ft);
  });
  return layer;
}

// 设置当前图层的元素，会清除原有的图层元素
// 之后调用添加函数
// 可以用于做清空处理，features传一个空数组
function _xlLayerSetFeatures(features, layer) {
  features = xlToArray(features);
  let source = _xlLayerGetSource(layer);
  source.clear();
  layer.xlAddFeatures(features);
  return layer;
}

// 热点图图层封装
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
  // 清空图层元素
  xlClear() {
    _xlLayerClear(this);
  }
  // 设置当前图层的元素，会清除原有的图层元素
  // 之后调用添加函数
  // 可以用于做清空处理，features传一个空数组
  xlSetFeatures(features) {
    _xlLayerSetFeatures(features, this);
    return this;
  }
  // 删除图层元素feature，features可以是数组可以是单个feature
  xlRemoveFeatures(features) {
    _xlLayerRemoveFeatures(features, this);
    return this;
  }
  // 添加图层元素feature，不会对原有元素造成影响
  // 可以使现成的Feature对象，也可以是一个对应的可生成feature的原生对象
  xlAddFeatures(features) {
    features = xlToArray(features);
    features = features.map((o) => {
      if (!(o instanceof Feature)) {
        return new MapFeatureHeatmap({ oriItem: o });
      }
      return o;
    });
    let source = _xlLayerGetSource(this);
    source.addFeatures(features);
  }
}

// 一个基础图层的封装，呈现，point，polygon，等
class MapLayerVector extends LayerVector {
  constructor(options = {}) {
    super();
    if (options.features) {
      this.xlSetFeatures(options.features);
    }
  }
  // 清空图层元素
  xlClear() {
    _xlLayerClear(this);
  }
  // 设置当前图层的元素，会清除原有的图层元素
  // 之后调用添加函数
  // 可以用于做清空处理，features传一个空数组
  xlSetFeatures(features) {
    _xlLayerSetFeatures(features, this);
    return this;
  }
  // 删除图层元素feature，features可以是数组可以是单个feature
  xlRemoveFeatures(features) {
    _xlLayerRemoveFeatures(features, this);
    return this;
  }
  // 添加图层元素feature，不会对原有元素造成影响
  // 可以使现成的Feature对象，也可以是一个对应的可生成feature的原生对象
  xlAddFeatures(features) {
    features = xlToArray(features);
    features = features.map((o) => {
      if (!(o instanceof Feature)) {
        if (o.type === "polygon") {
          return new MapFeaturePolygon({ oriItem: o });
        } else if (o.type === "circle") {
          return new MapFeatureCircle({ oriItem: o });
        } else if (o.type === "rectangle") {
          return new MapFeatureRectangle({ oriItem: o });
        } else if (o.type === "point") {
          return new MapFeaturePoint({ oriItem: o });
        }
      }
      return o;
    });
    let source = _xlLayerGetSource(this);
    source.addFeatures(features);
  }
}

export {
  MapLayerBasemap,
  MapLayerGroup,
  MapLayerVector, // 基本图层可以加入point，polygon等feature
  MapLayerHeadmap, // 热点图图层
};
