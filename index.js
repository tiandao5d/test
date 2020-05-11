import React, { Component, Fragment } from "react";
import ReactDom from "react-dom";
import {
  createMap,
  MapLayerVector,
  MapLayerHeadmap,
  MapDraw
} from "./MapServive";
import "./index.css";
let features = window.citys.map((o) => {
  return {
    type: 'point',
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
    point: [[115.242634,40.513654],[114.425525,39.174588],[115.342884,38.892436],[113.605584,38.831417],[115.242634,40.513654]],
  },
  {
    type: 'circle',
    center: [112,40],
    radius: 100000,
    style: {
      fill: 'rgba(0,0,0,0.5)',
      stroke: {
        color: '#ff0',
        width: 5
      },
    },
  },
  {
    type: 'rectangle',
    lefttop: [113,41],
    width: 100000,
    height: 50000,
    style: {
      fill: 'rgba(0,0,0,0.5)',
      stroke: {
        color: '#ff0',
        width: 5
      },
    },
  }
];

class Home extends Component {
  componentDidMount() {
    this.map = createMap("map");
    this.btnclick(1)
  }
  btnclick(type) {
    let layer1 = new MapLayerVector({
      features: [...features, ...pfs]
    });
    let layer2 = new MapLayerHeadmap({
      features
    });
    if (type === 0) {
      this.map.removeLayer(layer1);
      this.map.removeLayer(layer2);
    } else if (type === 1) {
      this.map.addLayer(layer1);
      this.map.addLayer(layer2);
      this.mapDrawCls = new MapDraw({
        map: this.map
      })
      this.mapDrawCls.xlOnEnd = function(res) {
        console.log(res)
        layer1.xlAddFeatures(res)
      }
      this.mapDrawCls.xlEnter('circle')
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
