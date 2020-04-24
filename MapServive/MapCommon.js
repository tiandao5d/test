import ol from "openlayers";
const Collection = ol.Collection;
const LayerGroup = ol.layer.Group;

const Feature = ol.Feature;
const SourceVector = ol.source.Vector;
const Point = ol.geom.Point;
const Polygon = ol.geom.Polygon;
const MultiPolygon = ol.geom.MultiPolygon;

function fromLonLat(point) {
  return ol.proj.fromLonLat(point);
}

function jsonCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 图层组
class MapLayerGroup {
  constructor() {
    this.group = new LayerGroup();
  }
  clear() {
    this.setLayers([]);
  }
  // 设置图层组中的图层，
  // 参数可以是一个包含图层的数组，也可以是一个单独的图层
  setLayers(layers) {
    if (!Array.isArray(layers)) {
      layers = [layers];
    }
    this.group.setLayers(new Collection(layers));
    return this.group;
  }
  // 过去当前图层组中的图层
  getLayers() {
    return this.group.getLayers();
  }
}

// 常用图层的基类
class MapBaseLayer {
  clear() {
    this.setFeatures([]);
  }
  // 添加数据点
  // 参数为数据点的集合，例如
  setFeatures(features) {
    let olFeatures = features.map((o) => {
      return new MapFeature({oriItem: o}).feature;
    });
    let source = new SourceVector({
      features: olFeatures,
    });
    this.layer.setSource(source);
  }
}


class MapFeature {
  constructor(options = {}){
    this.oriItem = jsonCopy(options.oriItem);
    this.feature = new Feature();
    this.init();
  }
  init() {
    let item = this.oriItem;
    let geometry;
    if ( item.type === 'polygon' ) {
      geometry = this.geometryPolygon(item.points);
    } else { // 默认是点
      geometry = this.geometryPoint(item.point);
    }
    this.feature.setGeometry(geometry);
    this.addFeatureMethods();
  }
  // 添加一些自定方法
  addFeatureMethods(options = {}) {
    let ft = this.feature;
    let oriItem = this.oriItem;
    let createStyle = options.createStyle;
    // xl开头辨别用户自定义方法
    // 设置单个feature的样式
    ft.xlSetStyle = function(style) {
      if ( ! ( typeof createStyle === 'function') ) {
        return false;
      }
      style = createStyle(style);
      this.setStyle(style);
    }
     // 原始数据存储
    ft.xlGetOriItemCopy = function(){
      return oriItem;
    };
  }
  stylePolygon(style = {}) {
    let d_fill = "rgba(0,0,0, 0.5)"; // 默认填充颜色
    let d_color = "#f0f"; // 默认边框颜色
    let d_width = 5; // 默认边框宽度
    let stroke = style.stroke || {};
    let fill = style.fill;
    return new Style({
      stroke: new Stroke({
        color: stroke.color || d_color,
        width: stroke.width || d_width,
      }),
      fill: new Fill({
        color: fill || d_fill,
      }),
    });
  }
  geometryTransform(geometry) {
    return geometry.transform("EPSG:4326", "EPSG:3857");
  }
  geometryPolygon(points) {
    let geometry = new Polygon([points]);
    this.geometryTransform(geometry);
    return geometry;
  }
  geometryPoint(point) {
    let geometry = new Point(point);
    this.geometryTransform(geometry);
    return geometry;
  }
}

export {
  fromLonLat,
  jsonCopy,
  MapLayerGroup,
  MapBaseLayer
}
