import ol from "openlayers";
import { jsonCopy, MapFeatureBase } from "./MapCommon";
const Feature = ol.Feature;

const LayerVector = ol.layer.Vector;
const SourceVector = ol.source.Vector;
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

class MapFeaturePoint extends MapFeatureBase {
  constructor(options = {}) {
		super();
    let item = this.oriItem = jsonCopy(options.oriItem);
		this.geometry = this.createGeometry(item.point);
    this.style = item.style.map(o => this.createStyle(o));
    this.feature = new Feature();
    this.reset();
  }
  createStyle(style) {
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
  createTitleStyle(title) {
    return new Style({
      text: new Text({
        offsetY: 30,
        text: title,
        fill: new Fill({
          color: '#000'
        })
      })
    })
  }
  createGeometry(point) {
    let geometry = new Point(point);
    this.geometryTransform(geometry);
    return geometry;
  }
}
export { MapFeaturePoint };
