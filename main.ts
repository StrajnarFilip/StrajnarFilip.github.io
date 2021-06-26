function toHexString(byteArray: Uint8Array) {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
function toByteArray(hexString: string) {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return result;
}

function AES_encrypt(plaintext: string, password: string) {

}
function AES_decrypt() {

}

function AES_GenerateKey() {
    window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    ).then((key) => {
        crypto.subtle.exportKey("raw", key).then((result) => {
            const exportedKeyBuffer = new Uint8Array(result);
            console.log(exportedKeyBuffer);
            console.log(toHexString(exportedKeyBuffer))
            let key_textbox = document.getElementById("key") as HTMLInputElement
            key_textbox.value = toHexString(exportedKeyBuffer)
        })

    })

}
function AES_GenerateIV(): string {
    let random_IV = window.crypto.getRandomValues(new Uint8Array(16))
    return toHexString(random_IV)
}


function main() {
    const enc = document.getElementById("encrypted")
    const plaintex = document.getElementById("plaintext");
    const encrypt_btn = document.getElementById("encrypt_btn")
    const keygen_btn = document.getElementById("keygen_btn")

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
            let y = plaintex as HTMLInputElement;
            AES_encrypt(y.value, "OOF")

        }
    })
    keygen_btn?.addEventListener("click", () => { AES_GenerateKey() })
}

window.addEventListener("load", main)