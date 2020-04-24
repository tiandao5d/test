import ol from "openlayers";
import { jsonCopy } from "./MapCommon";
const Feature = ol.Feature;
const Point = ol.geom.Point;

// 数据点格式
// [
//     {
//         point: [105, 35],
//         data: { // 给当前feature添加一些标识数据
//             id: '123'
//         }
//     }
// ]

class MapFeatureHeatmap extends Feature {
  constructor(options = {}) {
    super();
    this.xlOriItem = options.oriItem;
    this.xlSetPoint()
  }
  xlSetPoint(point = this.xlOriItem.point) {
    let geometry = new Point(point);
    geometry.transform("EPSG:4326", "EPSG:3857");
    this.setGeometry(geometry);
  }
  xlGetOriItemCopy() {
    return jsonCopy(this.xlOriItem);
  }
}
export { MapFeatureHeatmap };
