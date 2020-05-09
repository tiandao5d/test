import ol from "openlayers";
import { jsonCopy, geometryTransformToMap } from "./MapCommon";
const Feature = ol.Feature;
const Point = ol.geom.Point;
const Style = ol.style.Style;
const Fill = ol.style.Fill;
const Text = ol.style.Text;
const Stroke = ol.style.Stroke;
const Modify = ol.interaction.Modify;
const Collection = ol.Collection;
// 数据点格式
// [
//     {
//         point: [105, 35],
//         style: [
//           {
//             color: "#f00",
//             font: "50px arial",
//             text: "\u25cf",
//           },
//           {
//             color: "#fff",
//             font: "12px arial",
//             text: "11",
//           },
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
    // 记录编辑数据
    this.modify = null;
  }
  // 退出编辑状态
  xlExitDraw(map) {
    if ( this.modify ) {
      map.removeInteraction(this.modify);
      this.modify = null;
    }
  }
  // 进入编辑状态
  xlEnterDraw(map) {
    this.xlExitDraw(map);
    let modify = new Modify({features: new Collection([this])});
    map.addInteraction(modify);
    this.modify = modify;

    return this;
  }
  // 进入或退出选中状态，type === false为退出选中
  xlSetSelected(type, style) {
    if ( type === false ) { // 还原原有的样式状态
      this.xlSetStyle();
      return this;
    }
    // 选中的样式，如果给值，就是将第一个元素样式改成给的值
    // 默认是给第一个字体加一个边框
    style = style || this.xlOriItem.selectedStyle || Object.assign({}, this.xlOriItem.style[0], {
      stroke: {
        color: '#000',
        width: 5
      }
    })
    let oriStyle = jsonCopy(this.xlOriItem.style);
    oriStyle[0] = style;
    this.xlSetStyle(oriStyle);
    return this;
  }
  xlSetPoint(point = this.xlOriItem.point) {
    let geometry = new Point(point);
    geometryTransformToMap(geometry);
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
