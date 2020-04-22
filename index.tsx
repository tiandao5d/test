import * as React from 'react';
import * as ReactDOM from 'react-dom';
function Home(props: {a: string}): any {
    return (
    <div>123{props.a}</div>
    )
}
let y = '123'
// let yy = ReactDOM.createPortal(<Home />, document.getElementById('root'))
// console.log(yy)
ReactDOM.render(<Home a={y} />, document.getElementById('root'));
