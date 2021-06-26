function AES_encrypt(plaintext: string, password: string) {
    console.log("Encryption called");
    let ob = CryptoJS.AES.encrypt(plaintext, password);
    console.log(`Object :${ob},\nAlgo: ${ob.algorithm},\nBlocksize: ${ob.blockSize},\nCyphertext: ${ob.ciphertext},\nIV: ${ob.iv},\nKey: ${ob.key},\n Mode: ${ob.mode},\nPadding: ${ob.padding},\nSalt: ${ob.salt}`);
}
function AES_decrypt() {
    CryptoJS.AES.decrypt("","")
}


function main() {
    const enc = document.getElementById("encrypted")
    const plaintex = document.getElementById("plaintext");
    const encrypt_btn = document.getElementById("encrypt_btn")

    console.log("hi");
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker allowed");
    }
    const reset = document.getElementById("reset_cache")
    reset?.addEventListener("click", async () => {
        const all_cache_names = await caches.keys();
        all_cache_names.forEach(cache_name => {
            caches.delete(cache_name);
        });
    })


    encrypt_btn?.addEventListener("click", () => {
        console.log("Button clicked!");
        if (enc != null) {
            let x = enc as HTMLInputElement
            x.value = "Hello"
            console.log("value set to hello");
            let y= plaintex as HTMLInputElement;
            AES_encrypt(y.value, "OOF")

        }
    })

}

window.addEventListener("load", main)