/** @jsx h */
import {diff, h, mount, render} from "./vdom";
import './styles.scss';

const App = (props) => (<div id={'app'} count={props.year}>
    <ul>
        <li className={'my-class'}>Item 1</li>
        <li>{props.year}</li>
        <li><input type={'text'} /></li>
        {props.year % 2 === 0 ? <li>its me</li> : ''}
        <li className={props.year % 2 !== 0 ? 'last-item' : 'the-real-last-item'}>
            {props.year} % 2 is <pre>{(props.year % 2)}</pre>
        </li>
    </ul>
    <p>Copyright &copy; {props.year}</p>
</div>);

// let count = 10;
// let app = h('div',
//     {
//         id: 'app',
//     },
//     [
//         Counter({ count }),
//         h('img', {
//             attributes: {
//                 src: 'https://picsum.photos/500/500'
//             }
//         })
//     ]);

let $el = (selector) => document.querySelector(selector);
let root = $el('#app');

// App
let year = 2021;
let virtualTree = App({ year: (year++).toString() });
// end App

root = mount(render(virtualTree), root);
setInterval(() => {
    const updatedVirtualTree = App({ year: (year++).toString() });
    const patch = diff(virtualTree, updatedVirtualTree);
    root = patch(root);
    virtualTree = updatedVirtualTree;
}, 1000);

