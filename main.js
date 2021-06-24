
function main() {
    console.log("hi");
    document.getElementsByTagName("p")[0].onclick(()=>{console.log("clicked");})
}

document.addEventListener("load", main)