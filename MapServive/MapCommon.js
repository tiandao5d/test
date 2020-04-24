import ol from "openlayers";
const Collection = ol.Collection;
const LayerGroup = ol.layer.Group;
const LayerHeatmap = ol.layer.Heatmap;
const LayerVector = ol.layer.Vector;
const SourceVector = ol.source.Vector;

function fromLonLat(point) {
  return ol.proj.fromLonLat(point);
}

function geometryTransform (geometry) {
  geometry.transform("EPSG:4326", "EPSG:3857");
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

class MapLayerHeadmap extends LayerHeatmap {
  constructor(options = {}) {
    super({
      blur: 15,
      radius: 10,
      weight: function(feature) {
        return Math.random();
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
  fromLonLat,
  jsonCopy,
  geometryTransform,
  MapLayerGroup,
  MapLayerHeadmap,
  MapLayerVector,
};
