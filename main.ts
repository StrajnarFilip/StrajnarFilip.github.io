function toHexString(byteArray: Uint8Array): string {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
function toByteArray(hexString: string): Uint8Array {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(result);
}

function AES_encrypt(hex_plaintext: string, hex_key: string) {
    let key_import = crypto.subtle.importKey("raw", toByteArray(hex_key), "AES-CBC", true, ["encrypt", "decrypt"])
    let iv = toByteArray(AES_GenerateIV())
    key_import.then((key) => {
        let result = window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv
            },
            key,
            toByteArray(hex_plaintext)
        );

        result.then((encrypted_array) => {
            let u8arr = new Uint8Array(encrypted_array)
            let hex_array_withiv = toHexString(u8arr) + toHexString(iv)
            console.log(`Encrypted:\n${hex_array_withiv}`);
            const enc = document.getElementById("encrypted")
            const enc_txtbox = enc as HTMLInputElement
            enc_txtbox.value = hex_array_withiv
        })
    })

}
function AES_decrypt(hex_cyphertext: string, hex_key: string) {
    let key_import = crypto.subtle.importKey("raw", toByteArray(hex_key), "AES-CBC", true, ["encrypt", "decrypt"])
    let cyphertext_arr = toByteArray(hex_cyphertext)
    let cyphertext = cyphertext_arr.slice(cyphertext_arr.length - 16)

    let iv = toByteArray(hex_cyphertext).slice(-16)
    key_import.then((key) => {
        let result = window.crypto.subtle.decrypt({
            name: "AES-CBC",
            iv
        }, key, cyphertext)
        result.then((decrypted_array) => {
            let u8arr = new Uint8Array(decrypted_array)
            let plaintext_hex = toHexString(u8arr)
            console.log(`Decrypted:\n${plaintext_hex}`);
            const plaintxtbox = document.getElementById("plaintext")
            const txtbox = plaintxtbox as HTMLInputElement
            txtbox.value = plaintext_hex
        })
    })

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

    let ivtxtbox = document.getElementById("IV") as HTMLInputElement
    ivtxtbox.value = toHexString(random_IV)
    return toHexString(random_IV)
}


function main() {

    const plaintex = document.getElementById("plaintext");
    const encrypt_btn = document.getElementById("encrypt_btn")
    const keygen_btn = document.getElementById("keygen_btn")
    const decryptbtn = document.getElementById("decrypt_btn")

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

        let plaintext_box = plaintex as HTMLInputElement;
        let key_textbox = document.getElementById("key") as HTMLInputElement
        AES_encrypt(plaintext_box.value, key_textbox.value)

    })
    keygen_btn?.addEventListener("click", () => { AES_GenerateKey() })
    decryptbtn?.addEventListener("click", () => {
        let key_textbox = document.getElementById("key") as HTMLInputElement
        let cyphertext = document.getElementById("encrypted") as HTMLInputElement
        AES_decrypt(cyphertext.value, key_textbox.value)
    })
}

window.addEventListener("load", main)