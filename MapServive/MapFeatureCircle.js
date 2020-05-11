/**
 * 圆也是一种特别的多边形，继承自多边形的形状类
 */
import ol from "openlayers";
import { _xlCircleToGeometry } from "./MapCommon";
import { MapFeatureShape } from "./MapFeaturePolygon";
const Circle = ol.geom.Circle;
const Modify = ol.interaction.Modify;
const Collection = ol.Collection;
// 数据格式
// [
//   {
//     type: "polygon",
//     style: {
//       fill: "rgba(0,0,0,0.5)",
//       stroke: {
//         color: "#ff0",
//         width: 5,
//       },
//     },
//     radius: 100,
//     center: [105, 35
//     ],
//   },
// ];

class MapFeatureCircle extends MapFeatureShape {
  constructor(options = {}) {
    super();
    this.xlOriItem = options.oriItem;
    this.xlSetCenter();
    this.xlSetStyle();
    // 记录编辑数据
    this._xlModify = null;
  }
  // 退出编辑状态
  xlExitDraw(map) {
    if (this._xlModify) {
      map.removeInteraction(this._xlModify);
      this._xlModify = null;
    }
  }
  // 进入编辑状态
  xlEnterDraw(map) {
    this.xlExitDraw(map);
    let modify = new Modify({ features: new Collection([this]) });
    map.addInteraction(modify);
    this._xlModify = modify;

    return this;
  }
  xlSetCenter(item = this.xlOriItem) {
    item = _xlCircleToGeometry(item);
    let geometry = new Circle(item.center, item.radius);
    this.setGeometry(geometry);
  }
}

export { MapFeatureCircle };
