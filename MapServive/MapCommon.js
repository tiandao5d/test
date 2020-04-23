import ol from "openlayers";
const Collection = ol.Collection;
const LayerGroup = ol.layer.Group;

const Feature = ol.Feature;
const SourceVector = ol.source.Vector;
const Point = ol.geom.Point;

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
  createFeature(item){
    let copyItem = jsonCopy(item);
    let ft = new Feature({
      geometry: new Point(fromLonLat(item.point)),
    });
     // 原始数据存储
    ft.getOriItemCopy = function(){
      return copyItem;
    };
    return ft;
  }
  // 添加数据点
  // 参数为数据点的集合，例如
  setFeatures(features) {
    let olFeatures = features.map((o) => {
      return this.createFeature(o);
    });
    let source = new SourceVector({
      features: olFeatures,
    });
    this.layer.setSource(source);
  }
}

export {
  fromLonLat,
  jsonCopy,
  MapLayerGroup,
  MapBaseLayer
}
