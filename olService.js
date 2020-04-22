import ol from 'openlayers';
const Map = ol.Map;
const View = ol.View;
const Collection = ol.Collection;
const Feature = ol.Feature;

const SourceXYZ = ol.source.XYZ;
const SourceVector = ol.source.Vector;

const LayerHeatmap = ol.layer.Heatmap;
const LayerGroup = ol.layer.Group;
const LayerTile = ol.layer.Tile;
const LayerVector = ol.layer.Vector;

const Point = ol.geom.Point;
const Style = ol.style.Style;
const Fill = ol.style.Fill;
const Text = ol.style.Text;
const Stroke = ol.style.Stroke;

export function fromLonLat(point) {
    return ol.proj.fromLonLat(point)
}

// 图层组
export class MapLayerGroup {
    constructor() {
        this.group = new LayerGroup();
    }
    clear() {
        this.setLayers([]);
    }
    // 设置图层组中的图层，
    // 参数可以是一个包含图层的数组，也可以是一个单独的图层
    setLayers(layers) {
        if ( !Array.isArray(layers) ) {
            layers = [layers];
        }
        this.group.setLayers(new Collection(layers));
        return this.group;
    }
    // 过去当前图层组中的图层
    getLayers() {
        return this.group.getLayers();
    }
}

// 底图图层
export class MapLayerBasemap extends MapLayerGroup {
    constructor() {
        super();
        this.oriItems = this.getOriItems();
        this.onSwitchItem(this.oriItems[0]);
    }
    // 切换图层
    onSwitchItem(item) {
        let k = typeof item === 'string' ? item : item.id;
        let layer = this[k]();
        this.setLayers(layer);
    }
    // 用于界面用户可切换图层的数据
    getOriItems() {
        return [
            { id: 'getOSM', title: 'osm' },
            { id: 'getGoogle', title: 'google' }
        ]
    }
    getOSM() {
        return new LayerTile({
            source: new ol.source.OSM()
        });
    }
    getGoogle() {
        return new LayerTile({
            title: "google street",
            coordSys: "gww",
            type: "base",
            source: new SourceXYZ({
                url: "https://mt2.google.cn/maps/vt?lyrs=m&hl=en-US&gl=CN&&x={x}&y={y}&z={z}",
                crossOrigin: "anonymous"
            })
        })
    }
}
export let mapLayerBasemapCls = new MapLayerBasemap();

export class MapLayerHeatmap{
    constructor(options = {}) {
        this.dataKey = 'f_data'; // 用于feature存储额外数据
        this.layer = this.createLayer();
        if ( options.features ) {
            this.setFeatures(options.features);
        }
    }
    clear(){
        this.setFeatures([]);
    }
    // 创建一个图层
    createLayer() {
        let layer = new LayerHeatmap({
            blur: 15,
            radius: 10,
            weight: function(feature) {
              return Math.random();
            }
        });
        return layer;
    }
    // 添加数据点
    // 参数为数据点的集合，例如
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
    setFeatures(features) {
        let olFeatures = features.map(o => {
            let ft = new Feature({
                geometry: new Point(fromLonLat(o.point))
            });
            ft.set(this.styleKey, o.style);
            if ( o.data ) {
                ft.set(this.dataKey, o.data)
            }
            return ft;
        });
        let source = new SourceVector({
            features: olFeatures
        });
        this.layer.setSource(source);
    }
}

// 数据点图层
export class MapLayerPoint {
    constructor(options = {}) {
        this.styleKey = 'f_style'; // 用于feature存储样式数据
        this.dataKey = 'f_data'; // 用于feature存储额外数据
        this.titleKey = 'f_title'; // 说明字段
        this.layer = this.createLayer();
        console.log(this)
        if ( options.features ) {
            this.setFeatures(options.features);
        }
    }
    clear(){
        this.setFeatures([]);
    }
    createStyle(style) {
        return new Style({
            text: new Text({
                text: style.text,
                font: style.font,
                fill: new Fill({
                    color: style.color
                }),
                stroke: (style.stroke ? new Stroke({
                    color: style.stroke.color,
                    width: style.stroke.width || 1
                }) : null)
            })
        })
    }
    // 创建一个图层
    createLayer() {
        let styleKey = this.styleKey;
        let titleKey = this.titleKey;
        let createStyle = this.createStyle;
        let layer = new LayerVector({
            style(feature){
                let styles = feature.get(styleKey);
                let title = feature.get(titleKey);
                styles = styles.map(o => {
                    return createStyle(o);
                });
                if ( title ) {
                    styles.push(new Style({
                        text: new Text({
                            offsetY: 30,
                            text: title,
                            fill: new Fill({
                                color: '#000'
                            })
                        })
                    }))
                }
                return styles;
            }
        });
        return layer;
    }
    // 添加数据点
    // 参数为数据点的集合，例如
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
    setFeatures(features) {
        let olFeatures = features.map(o => {
            let ft = new Feature({
                geometry: new Point(fromLonLat(o.point))
            });
            ft.set(this.styleKey, o.style);
            if ( o.data ) {
                ft.set(this.dataKey, o.data)
            }
            if ( o.title ) {
                ft.set(this.titleKey, o.title);
            }
            return ft;
        });
        let source = new SourceVector({
            features: olFeatures
        });
        this.layer.setSource(source);
    }
}


export function createMap(target) {
    const map = new Map({
        target,
        layers: [
            mapLayerBasemapCls.group
        ],
        view: new View({
            center: fromLonLat([104.41, 35.82]),
            zoom: 4
        })
    });
    map.on("singleclick", function (evt) {
        console.log(evt)
        let arr = [];
        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            arr.push(feature.get('f_data'));
            // layerTileGroupCls.group.setLayers(new Collection())
        });
        console.log(arr);
    })
    return map;
}
