
function main() {
    console.log("hi");
    navigator.serviceWorker.register("/sw.js")
}

window.addEventListener("load", main)