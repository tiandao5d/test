import ol from "openlayers";
import { MapBaseLayer } from "./MapCommon";
const LayerVector = ol.layer.Vector;

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

// 数据点图层
class MapLayerPoint extends MapBaseLayer {
  constructor(options = {}) {
    super();
    this.layer = this.createLayer();
    if (options.features) {
      this.setFeatures(options.features);
    }
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
  // 创建一个图层
  createLayer() {
    let createStyle = this.createStyle;
    let createTitleStyle = this.createTitleStyle;
    let layer = new LayerVector({
      style(feature) {
        let {style: styles, title} = feature.xlGetOriItemCopy();
        styles = styles.map((o) => {
          return createStyle(o);
        });
        if (title) {
          styles.push(createTitleStyle(title));
        }
        return styles;
      },
    });
    return layer;
  }
}

export { MapLayerPoint };
