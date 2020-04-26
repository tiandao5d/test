import ol from "openlayers";
import { jsonCopy, geometryTransform } from "./MapCommon";
const Feature = ol.Feature;
const Point = ol.geom.Point;
const Style = ol.style.Style;
const Fill = ol.style.Fill;
const Text = ol.style.Text;
const Stroke = ol.style.Stroke;
// 数据点格式
// [
//     {
//         point: [105, 35],
//         style: [
//             {
//                 color: '#f00',
//                 font: '30px arial',
//                 text: '\u25cf'
//             }
//         ],
//         data: { // 给当前feature添加一些标识数据
//             id: '123'
//         }
//     }
// ]

class MapFeaturePoint extends Feature {
  constructor(options = {}) {
    super();
    this.xlOriItem = options.oriItem;
    this.xlSetPoint();
    this.xlSetStyle();
  }
  xlSetPoint(point = this.xlOriItem.point) {
    let geometry = new Point(point);
    geometryTransform(geometry);
    this.setGeometry(geometry);
  }
  xlSetStyle(style = this.xlOriItem.style) {
    style = style.map((o) => this.xlCreateStyle(o));
    this.setStyle(style);
  }
  xlGetOriItemCopy() {
    return jsonCopy(this.xlOriItem);
  }
  xlCreateTitleStyle(title) {
    return new Style({
      text: new Text({
        offsetY: 30,
        text: title,
        fill: new Fill({
          color: "#000",
        }),
      }),
    });
  }
  xlCreateStyle(style) {
    return new Style({
      text: new Text({
        text: style.text,
        font: style.font,
        fill: new Fill({
          color: style.color,
        }),
        stroke: style.stroke
          ? new Stroke({
              color: style.stroke.color,
              width: style.stroke.width || 1,
            })
          : null,
      }),
    });
  }
}
export { MapFeaturePoint };
