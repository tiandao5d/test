import ol from "openlayers";
import { MapBaseLayer } from "./MapCommon";
const LayerVector = ol.layer.Vector;

const Style = ol.style.Style;
const Fill = ol.style.Fill;
const Stroke = ol.style.Stroke;
// 数据点格式
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
//     points: [
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

// 数据点图层
class MapLayerPolygon extends MapBaseLayer {
  constructor(options = {}) {
    super();
    this.layer = this.createLayer();
    if (options.features) {
      this.setFeatures(options.features);
    }
  }
  createStyle(style = {}) {
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
  // 创建一个图层
  createLayer() {
    let createStyle = this.createStyle;
    let layer = new LayerVector({
      style(feature) {
        let { style } = feature.xlGetOriItemCopy();
        return createStyle(style);
      },
    });
    return layer;
  }
}

export { MapLayerPolygon };
