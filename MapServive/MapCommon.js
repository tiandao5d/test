import ol from "openlayers";
const Collection = ol.Collection;
const LayerGroup = ol.layer.Group;
const LayerHeatmap = ol.layer.Heatmap;
const LayerVector = ol.layer.Vector;
const SourceVector = ol.source.Vector;

// 转进来
// 将外部使用的"EPSG:4326"转为openlayers使用的"EPSG:3857"
// 将[105,35]转成[11688546.533293726, 4163881.1440642904]
function pointToMap(point) {
  return ol.proj.transform(point, "EPSG:4326", "EPSG:3857")
}

// 转出去
// 将openlayers使用的"EPSG:3857"转为外部使用的"EPSG:4326"
// 将[11688546.533293726, 4163881.1440642904]转成[105,35]
function pointFromMap(point) {
  return ol.proj.transform(point, "EPSG:3857", "EPSG:4326")
}

// 转进来，需要转的对象不同
// 将外部使用的"EPSG:4326"转为openlayers使用的"EPSG:3857"
function geometryTransform (geometry) {
  geometry.transform("EPSG:4326", "EPSG:3857");
}

// 一种简单的对象拷贝，方便将原数据拷贝一份使用
// 不至于造成原数据的更改
function jsonCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

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
  // 过去当前图层组中的图层
  xlGetLayers() {
    return this.getLayers().getArray();
  }
}

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
  xlSetFeatures(features) {
    this.setSource(
      new SourceVector({
        features,
      })
    );
  }
}
class MapLayerVector extends LayerVector {
  constructor(options = {}) {
    super();
    if (options.features) {
      this.xlSetFeatures(options.features);
    }
  }
  xlSetFeatures(features) {
    this.setSource(
      new SourceVector({
        features,
      })
    );
  }
}

export {
  jsonCopy,
  pointToMap,
  pointFromMap,
  geometryTransform,
  MapLayerGroup,
  MapLayerHeadmap,
  MapLayerVector,
};
