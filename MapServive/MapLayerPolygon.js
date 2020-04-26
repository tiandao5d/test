import ol from "openlayers";
import { jsonCopy, geometryTransform } from "./MapCommon";
const Feature = ol.Feature;
const Polygon = ol.geom.Polygon;
const Style = ol.style.Style;
const Fill = ol.style.Fill;
const Stroke = ol.style.Stroke;
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
//     point: [
//       [120.08262882937571, 33.09494246306551],
//       [120.08863697756544, 33.09192235451286],
//       [120.08743534793108, 33.0868886097096],
//       [120.09756336917087, 33.078114822861224],
//       [120.09756336917087, 33.07710793888088],
//       [120.09361515749717, 33.07667641364708],
//       [120.0932718347445, 33.07336798319689],
//       [120.09996662844858, 33.06934016081212],
//       [120.10339985598429, 33.081998410251956],
//       [120.1126695703424, 33.07998471967618],
//       [120.11696110476878, 33.08516268800976],
//       [120.11318455447633, 33.0874639094147],
//       [120.11455784549108, 33.09220998836852],
//       [120.10683308352898, 33.09278525325749],
//       [120.10511646975849, 33.09825008195974],
//       [120.08314381350287, 33.10198897953166],
//       [120.08262882937571, 33.09494246306551],
//     ],
//   },
// ];
class MapFeatureShape extends Feature {
  // 进入或退出选中状态，type === false为退出选中
  xlSetSelected(type, style) {
    if ( type === false ) { // 还原原有的样式状态
      this.xlSetStyle();
      return this;
    }
    style = style || this.xlOriItem.selectedStyle || {
      fill: "rgba(0,0,0,0.5)",
      stroke: {
        color: "#f00",
        width: 5,
      },
    }
    this.xlSetStyle(style);
    return this;
  }
  xlSetStyle(style = this.xlOriItem.style) {
    style = this.xlCreateStyle(style);
    this.setStyle(style);
  }
  xlGetOriItemCopy() {
    return jsonCopy(this.xlOriItem);
	}
  xlCreateStyle(style = {}) {
    let d_fill = "rgba(0,0,0, 0.5)"; // 默认填充颜色
    let d_color = "#f0f"; // 默认边框颜色
    let d_width = 5; // 默认边框宽度
    let stroke = style.stroke || {};
    let fill = style.fill;
    return new Style({
      stroke: new Stroke({
        color: stroke.color || d_color,
        width: stroke.width || d_width,
      }),
      fill: new Fill({
        color: fill || d_fill,
      }),
    });
  }
}
class MapFeaturePolygon extends MapFeatureShape {
  constructor(options = {}) {
    super();
    this.xlOriItem = options.oriItem;
    this.xlSetPoint();
    this.xlSetStyle();
  }
  xlSetPoint(point = this.xlOriItem.point) {
		let geometry = new Polygon([point]);
		geometryTransform(geometry);
    this.setGeometry(geometry);
  }
}


export { MapFeaturePolygon, MapFeatureShape };
