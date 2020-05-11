import ol from "openlayers";

// 转进来
// 将外部使用的"EPSG:4326"转为openlayers使用的"EPSG:3857"
// 将[105,35]转成[11688546.533293726, 4163881.1440642904]
function xlPointToMap(point) {
  return ol.proj.transform(point, "EPSG:4326", "EPSG:3857");
}

// 转出去
// 将openlayers使用的"EPSG:3857"转为外部使用的"EPSG:4326"
// 将[11688546.533293726, 4163881.1440642904]转成[105,35]
function xlPointFromMap(point) {
  return ol.proj.transform(point, "EPSG:3857", "EPSG:4326");
}

// 转进来，需要转的对象不同
// 将外部使用的"EPSG:4326"转为openlayers使用的"EPSG:3857"
function _xlGeometryTransformToMap(geometry) {
  geometry.transform("EPSG:4326", "EPSG:3857");
}

// 转出去，需要转的对象不同
// 将外部使用的"EPSG:3857"转为openlayers使用的"EPSG:4326"
function _xlGeometryTransformFromMap(geometry) {
  geometry.transform("EPSG:3857", "EPSG:4326");
}

// 起始点左上角坐标点，宽度，高度
// 通过起始点坐标和宽高，画出polygon，也是rectangle
function xlRectangleToPoints(lefttop, w, h, is3857) {
  // lefttop为EPSG:4326坐标点
  if (is3857 !== true) {
    // 本身是3857的坐标点无需转换
    lefttop = xlPointToMap(lefttop);
  }
  let [x, y] = lefttop;
  let righttop = [x + w, y];
  let leftbottom = [x, y + h];
  let rightbottom = [x + w, y + h];
  return [lefttop, righttop, rightbottom, leftbottom, lefttop];
}

// 通过坐标点集合，返回rectangle的宽高等数据对象
function xlPointsToRectangle(oriPoints, type) {
  let points = oriPoints;
  let lefttop = oriPoints[0];
  if (type === "3857") {
    // 本身是3857的坐标点无需转换
    lefttop = xlPointFromMap(lefttop);
  } else {
    points = oriPoints.map((a) => xlPointToMap(a));
  }
  let c1 = points[0];
  let c2 = points[1];
  let c3 = points[2];
  return {
    lefttop,
    width: Math.abs(c2[0] - c1[0]),
    height: Math.abs(c2[1] - c3[1]),
  };
}

// 将用openlayers画出来的圆转为常用的模式
// 计算出openlayers的圆的实际半径
function _xlGeometryToCircle(geometry) {
  var center = geometry.getCenter();
  var radius = geometry.getRadius();
  var edgeCoordinate = [center[0] + radius, center[1]];
  var groundRadius = ol.Sphere.getLength(
    new ol.geom.LineString([center, edgeCoordinate]),
    { projection: "EPSG:3857" }
  );

  return {
    radius: Math.round(groundRadius),
    center: xlPointFromMap(center),
  };
}

// 外部通用转为ol使用的中心点和半径
function _xlCircleToGeometry({ center, radius } = obj) {
  const epsg3857Coord = ol.proj.transform(center, "EPSG:4326", "EPSG:3857");
  const [x, y] = epsg3857Coord;
  const diffCoordinate = [x + 1, y];
  const diffDistance = ol.Sphere.getLength(
    new ol.geom.LineString([
      center,
      ol.proj.transform(diffCoordinate, "EPSG:3857", "EPSG:4326"),
    ]),
    { projection: "EPSG:4326" }
  );
  const projectedRadius = radius / diffDistance;
  return { center: xlPointToMap(center), radius: Math.round(projectedRadius) };
}

// 一种简单的对象拷贝，方便将原数据拷贝一份使用
// 不至于造成原数据的更改
function xlJsonCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function xlToArray(item) {
  if (Array.isArray(item)) {
    return item;
  }
  return [item];
}

export {
  xlJsonCopy,
  xlPointToMap,
  xlPointFromMap,
  xlToArray,
  xlPointsToRectangle,
  xlRectangleToPoints,
  _xlGeometryTransformToMap,
  _xlGeometryTransformFromMap,
  _xlGeometryToCircle,
  _xlCircleToGeometry,
};
