import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import angular from 'angular';
function Hob() {
    return <div>Hob中文说明，函数组件</div>
}
class Home extends Component {
    constructor() {
        super();
        this.state = {
            num: 1
        }
    }
    bclick() {
        this.setState({ num: ++this.state.num })
    }
    render() {
        return (
            <div>
                <p></p>
                <p></p>
                <p></p>
                <Hob />
                <p></p>
                <p></p>
                <p></p>
                <div onClick={this.props.setName}>改变ng的name</div>
                <div onClick={this.bclick.bind(this)}>内容{this.state.num}</div>
            </div>
        )
    }
}
// console.log(11)
function getHome(props) {
    let div = document.createElement('div');
    // let a = ReactDOM.render(<div>33333</div>, div);
    let a = ReactDOM.render(React.createElement(Home, props), div);
    a.reactToNgEle = div;
    return a;
}
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    $scope.obj = { name: "John Doe" };
    $scope.setName = function () {
        $scope.obj.name += 1;
        $scope.safeApply();
    }
    $scope.setReactNum = function () {
        rcls.bclick();
    }
    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    let rcls = getHome({
        setName: $scope.setName
    })
    document.getElementById('root').appendChild(rcls.reactToNgEle);
});

// ReactDOM.render(<Home />, document.getElementById('root'));