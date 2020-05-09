/**
 * 画图的api
 */

import ol from 'openlayers';
import {geometryTransformFromMap} from './MapCommon'
const Draw = ol.interaction.Draw;
const createBox = Draw.createBox;

class MapDraw {
    constructor(options = {}) {
        this.map = options.map; // 一个初始map
        this.layer = options.layer; // 一个图层用于画图的初始图层
        this.draw = null; //记录当前绘画
    }
    // 进入绘画状态
    xlEnter(type, layer = this.layer, map = this.map) {
        let that = this;
        that.xlExit();
        let draw = that.draw = that.xlCreate(type, layer);
        function dkeydown(e) { // 按esc执行完成事件
            if ( e.keyCode === 27 ) {
                draw.finishDrawing();
            }
        }
        document.addEventListener('keydown', dkeydown);
        draw.on('drawend', e => {
            let oriFt = e.feature;
            let ft = oriFt.clone(); // 克隆一个出来使用，不影响原有画图数据
            let geometry = ft.getGeometry();
            geometryTransformFromMap(geometry);
            let res = {};
            switch(type) {
                case 'point':
                case 'line':
                    res.points = geometry.getCoordinates();
                    break;
                case 'polygon':
                case 'rectangle':
                    res.points = geometry.getCoordinates()[0];
                    break;
                case 'circle':
                    type = 'Circle';
                    res.center = geometry.getCenter();
                    res.radius = geometry.getRadius();
                    break;
            }
            // 删掉原始的feature，不能使用自动生成的feature
            Promise.resolve()
            .then(() => {
                layer.getSource().removeFeature(oriFt);
            })
            that.xlExit(); // 完成后退出画图
            if ( typeof that.xlOnEnd === 'function' ) {
                that.xlOnEnd(res); // 回调监听
            }
        });
        map.addInteraction(draw);
        that.xlExit = function() { // 在实例上赋值一个退出状态
            map.removeInteraction(draw);
            document.removeEventListener('keydown', dkeydown); // 注销事件监听
        }
        return this;
    }
    // 退出绘画状态
    xlExit(draw = this.draw, map = this.map) {
        if ( draw ) {
            map.removeInteraction(draw);
        }
        return this;
    }
    xlCreate(type, layer) {
        let geometryFunction = null;
        switch(type) {
            case 'point':
                type = 'Point';
                break;
            case 'line':
                type = 'LineString';
                break;
            case 'polygon':
                type = 'Polygon';
                break;
            case 'rectangle':
                type = 'Circle';
                geometryFunction = createBox();
                break;
            case 'circle':
                type = 'Circle';
                break;
        }
        let drawOptions = {
            source: layer.getSource(),
            type
        }
        if ( geometryFunction ) {
            drawOptions.geometryFunction = geometryFunction;
        }
        return new Draw(drawOptions);
    }
}

export {MapDraw}
