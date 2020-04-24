import React, { Component, Fragment } from "react";
import ReactDom from "react-dom";
import {
  createMap,
  MapLayerHeatmap,
  MapLayerPoint,
  MapLayerPolygon,
} from "./MapServive";
import "./index.css";
let features = window.citys.map((o) => {
  return {
    point: o.lnglat,
    style: [
      {
        color: "#f00",
        font: "50px arial",
        text: "\u25cf",
      },
      {
        color: "#fff",
        font: "12px arial",
        text: "11",
      },
    ],
    title: o.name,
    data: {
      // 给当前feature添加一些标识数据
      ...o,
    },
  };
});
features.length = 10;
console.log(features.slice(0, 10));
let pfs = [
  {
    type: "polygon",
    style: {
      fill: 'rgba(0,0,0,0.5)',
      stroke: {
        color: '#ff0',
        width: 5
      },
    },
    points: [[115.242634,40.513654],[114.425525,39.174588],[115.342884,38.892436],[113.605584,38.831417],[115.242634,40.513654]],
  },
];

let mapLayerPointCls = new MapLayerPoint({ features });
let mapLayerHeatmapCls = new MapLayerHeatmap({ features });
let mapLayerPolygonCls = new MapLayerPolygon({ features: pfs });

class Home extends Component {
  componentDidMount() {
    this.map = createMap("map");
    this.btnclick(1)
  }
  btnclick(type) {
    console.log("的分公司的");
    let layer1 = mapLayerPointCls.layer;
    let layer2 = mapLayerHeatmapCls.layer;
    let layer3 = mapLayerPolygonCls.layer;
    if (type === 0) {
      this.map.removeLayer(layer1);
      this.map.removeLayer(layer2);
      this.map.removeLayer(layer3);
    } else if (type === 1) {
      this.map.addLayer(layer1);
      this.map.addLayer(layer2);
      this.map.addLayer(layer3);
    }
  }
  render() {
    return (
      <Fragment>
        <div id="map"></div>
        <div id="main">
          <button onClick={() => this.btnclick(1)}>点击</button>
          <button onClick={() => this.btnclick(0)}>remove</button>
        </div>
      </Fragment>
    );
  }
}

ReactDom.render(<Home />, document.getElementById("root"));
