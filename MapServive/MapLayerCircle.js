/**
 * 圆也是一种特别的多边形，继承自多边形的形状类
 */
import ol from "openlayers";
import { pointToMap } from "./MapCommon";
import { MapFeatureShape } from './MapLayerPolygon';
const Circle = ol.geom.Circle;
const Modify = ol.interaction.Modify;
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
//     radius: 100,
//     center: [105, 35
//     ],
//   },
// ];

function getProjectedRadius(center, radius) {
  const epsg3857Coord = ol.proj.transform(center, "EPSG:4326", "EPSG:3857");
  const [x, y] = epsg3857Coord;
  const diffCoordinate = [x + 1, y];
  const diffDistance = ol.Sphere.getLength(
    new ol.geom.LineString([
      center,
      ol.proj.transform(diffCoordinate, "EPSG:3857", "EPSG:4326")
    ]),
    { projection: "EPSG:4326" }
  );
  const projectedRadius = radius / diffDistance;
  console.log(Math.round(projectedRadius))
  return Math.round(projectedRadius);
}

class MapFeatureCircle extends MapFeatureShape {
  constructor(options = {}) {
    super();
    this.xlOriItem = options.oriItem;
    this.xlSetCenter();
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
  xlSetCenter({center, radius} = this.xlOriItem) {
		let geometry = new Circle(pointToMap(center), getProjectedRadius(center, radius));
		// geometryTransform(geometry);
    this.setGeometry(geometry);
  }
}

export { MapFeatureCircle };
