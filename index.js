import React, {Component, Fragment} from 'react';
import ReactDom from 'react-dom';
import {createMap, MapLayerHeatmap, MapLayerPoint} from './olService'
import './index.css';
let features = window.citys.map(o => {
    return {
        point: o.lnglat,
        style: [
            {
                color: '#f00',
                font: '50px arial',
                text: '\u25cf'
            },
            {
                color: '#fff',
                font: '12px arial',
                text: '11'
            }
        ],
        data: { // 给当前feature添加一些标识数据
            ...o
        }
    }
})
console.log(features.slice(0,10))
let mapLayerPointCls = new MapLayerPoint({features});
// let mapLayerHeatmapCls = new MapLayerHeatmap({features});

class Home extends Component {
  componentDidMount(){
    this.map = createMap('map');
  }
  btnclick(type) {
    console.log('的分公司的')
    let layer = mapLayerPointCls.layer
    if ( type === 0 ) {
      this.map.removeLayer(layer)
    } else if ( type === 1 ) {
      this.map.addLayer(layer)
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
    )
  }
}

ReactDom.render(<Home/>, document.getElementById('root'))