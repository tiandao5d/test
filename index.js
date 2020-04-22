import React, {Component, Fragment} from 'react';
import ReactDom from 'react-dom';
import {createMap} from './olService'
import './index.css';

class Home extends Component {
  componentDidMount(){
    createMap('map');
  }
  render() {
    return (
      <Fragment>
        <div id="map"></div>
        <div id="main">main</div>
      </Fragment>
    )
  }
}

ReactDom.render(<Home/>, document.getElementById('root'))