import React, { Component } from 'react';
function Hob() {
    return <div>Hob中文说明，函数组件</div>
}
// class Home extends Component {
//     constructor() {
//         super();
//         this.state = {
//             num: 1
//         }
//     }
//     bclick() {
//         this.setState({ num: ++this.state.num })
//     }
//     render() {
//         return (
//             <div>
//                 <p></p>
//                 <p></p>
//                 <p></p>
//                 <Hob />
//                 <p></p>
//                 <p></p>
//                 <p></p>
//                 <div onClick={this.props.setName}>改变ng的name</div>
//                 <div onClick={this.bclick.bind(this)}>内容{this.state.num}</div>
//             </div>
//         )
//     }
// }
export default Hob;