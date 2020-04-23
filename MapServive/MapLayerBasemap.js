import ol from "openlayers";
import { MapLayerGroup } from "./MapCommon";

const SourceOSM = ol.source.OSM;
const SourceXYZ = ol.source.XYZ;
const LayerTile = ol.layer.Tile;

// 底图图层
class MapLayerBasemap extends MapLayerGroup {
  constructor() {
    super();
    this.oriItems = this.getOriItems();
    this.onSwitchItem(this.oriItems[0]);
  }
  // 切换图层
  onSwitchItem(item) {
    let k = typeof item === "string" ? item : item.id;
    let layer = this[k]();
    this.setLayers(layer);
  }
  // 用于界面用户可切换图层的数据
  getOriItems() {
    return [
      { id: "getOSM", title: "osm" },
      { id: "getGoogle", title: "google" },
    ];
  }
  getOSM() {
    return new LayerTile({
      source: new SourceOSM(),
    });
  }
  getGoogle() {
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
  }
}
export { MapLayerBasemap };
