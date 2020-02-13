import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import "./i18n"

const startApp = cordova => {
    ReactDOM.render(
        <Suspense fallback="loading">
            <App cordova={cordova} />
        </Suspense>,
        document.getElementById("root")
    )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
if (!window.cordova) {
    console.log("cordova isnt activated")
    startApp(false)
} else {
    console.log("activated cordova - starting react app")
    document.addEventListener("deviceready", () => startApp(true), false)
}
