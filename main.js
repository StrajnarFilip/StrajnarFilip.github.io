
function main() {
    console.log("hi");
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker allowed");
    }
}

window.addEventListener("load", main)