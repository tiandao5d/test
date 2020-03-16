let React = require('react');
let ReactDOM = require('react-dom');
let Component = React.Component;

// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

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
                <div>抬头</div>
                <div onClick={this.bclick.bind(this)}>内容{this.state.num}</div>
            </div>
        )
    }
}

function getHome(props) {
    let div = document.createElement('div');
    // let a = ReactDOM.render(<div>33333</div>, div);
    let a = ReactDOM.render(React.createElement(Home, props), div);
    console.log(div)
    a.reactToNgEle = div;
    return a;
}

ReactDOM.render(<Home />, document.getElementById('root'));
// // module.exports = {getHome};
// // export default getHome;


// let a = () => {
//     return 123
// }

// document.getElementById('root').innerHTML = a();