function AES_encrypt(plaintext: string, password: string) {
    let ob = CryptoJS.AES.encrypt(plaintext, password);
    console.log(`${ob.algorithm},${ob.blockSize},${ob.ciphertext},${ob.iv},${ob.key},${ob.mode},${ob.padding},${ob.salt}`);
}
function AES_decrypt() {

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
        if (enc != null) {
            enc.nodeValue = "OK"
            if (plaintex?.nodeValue != null) {
                AES_encrypt(plaintex.nodeValue, "OOF")
            }
        }
    })

}

window.addEventListener("load", main)