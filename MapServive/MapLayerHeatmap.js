import ol from "openlayers";
import { MapBaseLayer } from "./MapCommon";
const LayerHeatmap = ol.layer.Heatmap;

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

class MapLayerHeatmap extends MapBaseLayer {
  constructor(options = {}) {
    super();
    this.layer = this.createLayer();
    if (options.features) {
      this.setFeatures(options.features);
    }
  }
  // 创建一个图层
  createLayer() {
    let layer = new LayerHeatmap({
      blur: 15,
      radius: 10,
      weight: function(feature) {
        return Math.random();
      },
    });
    return layer;
  }
}

export { MapLayerHeatmap };
