/**
 * 画图的api
 * 只能一个个的画图，画完一个图之后会自动退出画图状态
 */

import ol from "openlayers";
import {
  _xlGeometryTransformFromMap,
  xlPointsToRectangle,
  _xlGeometryToCircle,
} from "./MapCommon";
import { MapLayerVector } from "./MapLayerBase";

const Draw = ol.interaction.Draw;
const createBox = Draw.createBox;

// 创建一个画图实例，内部方法，不向外提供
function _xlCreate(type, layer) {
  let geometryFunction = null;
  switch (type) {
    case "point":
      type = "Point";
      break;
    case "line":
      type = "LineString";
      break;
    case "polygon":
      type = "Polygon";
      break;
    case "rectangle":
      type = "Circle";
      geometryFunction = createBox();
      break;
    case "circle":
      type = "Circle";
      break;
  }
  let drawOptions = {
    source: layer.getSource(),
    type,
  };
  if (geometryFunction) {
    drawOptions.geometryFunction = geometryFunction;
  }
  return new Draw(drawOptions);
}

// 绘画完成后，返回相应的数据值，内部方法
function _xlDrawend(e, type) {
  let oriFt = e.feature;
  let oriGeometry = oriFt.getGeometry();
  let ft = oriFt.clone(); // 克隆一个出来使用，不影响原有画图数据
  let geometry = ft.getGeometry();
  _xlGeometryTransformFromMap(geometry);
  let res = {};
  switch (type) {
    case "point":
    case "line":
      res.point = geometry.getCoordinates();
      break;
    case "polygon":
      res.point = geometry.getCoordinates()[0];
      break;
    case "rectangle":
      res = xlPointsToRectangle(oriGeometry.getCoordinates()[0], "3857");
      break;
    case "circle":
      res = _xlGeometryToCircle(oriGeometry);
      break;
  }
  res.type = type;
  return res;
}

class MapDraw {
  constructor(options = {}) {
    this.xlMap = options.map; // 一个初始map

    // _xl开头请勿外部使用
    this._xlLayer = null; // 一个图层用于画图的初始图层，退出绘图时会删除
    this._xlDraw = null; //记录当前绘画
    this._xlDocCb = null; // 用于方便解除绑定的
  }
  // 进入绘画状态
  xlEnter(type) {
    let that = this;
    let map = this.xlMap;
    let layer = new MapLayerVector(); // 创建基础图层，用于绘图
    that.xlExit(); // 格式化先前的设置
    map.addLayer(layer);
    let draw = (that._xlDraw = _xlCreate(type, layer)); // 创建绘图实例
    that._xlDocCb = function(e) {
      // 全局监听事件，方便处理退出绘画和完成绘画
      if (e.keyCode === 13) {
        draw.finishDrawing();
      } else if (e.keyCode === 27) {
        that.xlExit();
      }
    };
    document.addEventListener("keydown", that._xlDocCb); // 监听用户交互
    draw.on("drawend", (e) => {
      let res = _xlDrawend(e, type); // 完成绘图后，将结果整理为外部可用的
      if (typeof that.xlOnEnd === "function") {
        // 绘画结束完成
        that.xlOnEnd(res); // 回调监听
      }
      // that.xlExit(); // 完成后退出画图
    });
    map.addInteraction(draw);
    return this;
  }

  // 退出绘画状态
  xlExit() {
    if (this._xlDraw) {
      this.map.removeInteraction(this._xlDraw);
      this._xlDraw = null;
    }
    if (this._xlDocCb) {
      document.removeEventListener("keydown", this._xlDocCb); // 注销事件监听
      this._xlDocCb = null;
    }
    if (this._xlLayer) {
      this.map.removeLayer(this._xlLayer);
      this._xlLayer = null;
    }
    if (typeof this.xlOnExit === "function") {
      // 退出绘画
      this.xlOnExit();
    }
    return this;
  }
}

export { MapDraw };
