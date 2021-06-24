
function main() {
    console.log("hi");
    document.getElementsByTagName("p")[0].onclick(()=>{console.log("clicked");})
}
console.log("Not ready");

document.addEventListener("load", main)