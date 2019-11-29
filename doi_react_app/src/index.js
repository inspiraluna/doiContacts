import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const startApp = (cordova) => {
    ReactDOM.render(<App cordova={cordova}/>,document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if(!window.cordova) {
    console.log('didnt find cordova')
    startApp(false)
} else {
    console.log('found cordova')
    document.addEventListener('deviceready', () => startApp(true), false)
}
