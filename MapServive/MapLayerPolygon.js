import ol from "openlayers";
import { jsonCopy, geometryTransformToMap } from "./MapCommon";
const Feature = ol.Feature;
const Polygon = ol.geom.Polygon;
const Style = ol.style.Style;
const Fill = ol.style.Fill;
const Stroke = ol.style.Stroke;
const Modify = ol.interaction.Modify;
const Translate = ol.interaction.Translate;
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
// 所有形状的默认样式
function getShapeDefaultStyle(type) {
  if ( type === true ) { // 选中状态
    return {
      fill: "rgba(0,0,0,0.5)",
      stroke: {
        color: "#f00",
        width: 5,
      },
    }
  }
  return {
    fill: 'rgba(0,0,0,0.5)',
    stroke: {
      color: '#ff0',
      width: 5
    },
  }
}

// 形状基类，矩形，圆，多边形等都继承自此基类
class MapFeatureShape extends Feature {
  // 进入或退出选中状态，type === false为退出选中
  xlSetSelected(type, style) {
    if ( type === false ) { // 还原原有的样式状态
      this.xlSetStyle();
      return this;
    }
    style = style || this.xlOriItem.selectedStyle || getShapeDefaultStyle(true)
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
    let dstyle = getShapeDefaultStyle();
    style = Object.assign({}, dstyle, style);
    let stroke = style.stroke;
    let fill = style.fill;
    return new Style({
      stroke: new Stroke(stroke),
      fill: new Fill({
        color: fill,
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
    // 记录编辑数据
    this.modify = null;
    this.translate = null;
  }
  // 退出编辑状态
  xlExitDraw(map) {
    if ( this.modify ) {
      map.removeInteraction(this.modify);
      this.modify = null;
    }
    if ( this.translate ) {
      map.removeInteraction(this.translate);
      this.translate = null;
    }
  }
  // 进入编辑状态
  xlEnterDraw(map) {
    this.xlExitDraw(map);
    let modify = new Modify({features: new Collection([this])});
    map.addInteraction(modify);
    this.modify = modify;

    let translate = new Translate({features: new Collection([this])});
    map.addInteraction(translate);
    this.translate = translate;

    return this;
  }
  xlSetPoint(point = this.xlOriItem.point) {
		let geometry = new Polygon([point]);
		geometryTransformToMap(geometry);
    this.setGeometry(geometry);
  }
}


export { MapFeaturePolygon, MapFeatureShape, getShapeDefaultStyle };
