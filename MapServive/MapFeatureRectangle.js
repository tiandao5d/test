/**
 * 矩形也是一种特别的多边形，继承自多边形的形状类
 */
import ol from "openlayers";
import { xlRectangleToPoints } from "./MapCommon";
import { MapFeatureShape } from './MapFeaturePolygon'
const Polygon = ol.geom.Polygon;
const Collection = ol.Collection;
const Translate = ol.interaction.Translate;
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
//     width: 100,
//     height: 100,
//     lefttop: [105.35],
//   },
// ];

class MapFeatureRectangle extends MapFeatureShape {
  constructor(options = {}) {
    super();
    this.xlOriItem = options.oriItem;
    this.xlSetPoint();
    this.xlSetStyle();
    this._xlTranslate = null;
  }
  // 退出编辑状态
  xlExitDraw(map) {
    if ( this._xlTranslate ) {
      map.removeInteraction(this._xlTranslate);
      this._xlTranslate = null;
    }
  }
  // 进入编辑状态
  xlEnterDraw(map) {
    this.xlExitDraw(map);
    let translate = new Translate({features: new Collection([this])});
    map.addInteraction(translate);
    this._xlTranslate = translate;
    return this;
  }
  xlSetPoint({lefttop, width, height} = this.xlOriItem) {
		let geometry = new Polygon([xlRectangleToPoints(lefttop, width, height)]);
    this.setGeometry(geometry);
  }
}

export { MapFeatureRectangle };
