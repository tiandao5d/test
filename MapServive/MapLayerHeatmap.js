import ol from "openlayers";
import { jsonCopy, geometryTransformToMap } from "./MapCommon";
const Feature = ol.Feature;
const Point = ol.geom.Point;

// 数据点格式
// [
//     {
//         point: [105, 35],
//         weight: 0.1,
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
    geometryTransformToMap(geometry);
    this.setGeometry(geometry);
  }
  xlGetOriItemCopy() {
    return jsonCopy(this.xlOriItem);
  }
}
export { MapFeatureHeatmap };
