/**
 * 矩形也是一种特别的多边形，继承自多边形的形状类
 */
import ol from "openlayers";
import { pointToMap } from "./MapCommon";
import { MapFeatureShape } from './MapLayerPolygon'
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

// 起始点左上角坐标点，宽度，高度
function toPoints(lefttop, w, h) {
  lefttop = pointToMap(lefttop);
  let [x, y] = lefttop;
  let righttop = [x + w, y];
  let leftbottom = [x, y + h];
  let rightbottom = [x + w, y + h];
  return [
    lefttop,
    righttop,
    rightbottom,
    leftbottom,
    lefttop
  ];
}

class MapFeatureRectangle extends MapFeatureShape {
  constructor(options = {}) {
    super();
    this.xlOriItem = options.oriItem;
    this.xlSetPoint();
    this.xlSetStyle();
    this.translate = null;
  }
  // 退出编辑状态
  xlExitDraw(map) {
    if ( this.translate ) {
      map.removeInteraction(this.translate);
      this.translate = null;
    }
  }
  // 进入编辑状态
  xlEnterDraw(map) {
    this.xlExitDraw(map);
    let translate = new Translate({features: new Collection([this])});
    map.addInteraction(translate);
    this.translate = translate;
    return this;
  }
  xlSetPoint({lefttop, width, height} = this.xlOriItem) {
		let geometry = new Polygon([toPoints(lefttop, width, height)]);
    this.setGeometry(geometry);
  }
}

export { MapFeatureRectangle };
