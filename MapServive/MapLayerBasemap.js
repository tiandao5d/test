import ol from "openlayers";
import { MapLayerGroup } from "./MapCommon";

const SourceOSM = ol.source.OSM;
const SourceXYZ = ol.source.XYZ;
const LayerTile = ol.layer.Tile;

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
    let layer = this[k]();
    this.xlSetLayers(layer);
  }
  // 用于界面用户可切换图层的数据
  xlGetOriItems() {
    return [
      { id: "xlGetOSM", title: "osm" },
      { id: "xlGetGoogle", title: "google" },
    ];
  }
  xlGetOSM() {
    return new LayerTile({
      source: new SourceOSM(),
    });
  }
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
  }
}
export { MapLayerBasemap };
