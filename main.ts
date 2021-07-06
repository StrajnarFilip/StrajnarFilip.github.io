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

function AES_encrypt_callback(hex_enc: string) {
    console.log(`Encrypted:\n${hex_enc}`);
    const enc = document.getElementById("encrypted")
    const enc_txtbox = enc as HTMLInputElement
    enc_txtbox.value = hex_enc
}

function AES_decrypt_callback(plaintext_hex: string) {
    console.log(`Decrypted:\n${plaintext_hex}`);
    const plaintxtbox = document.getElementById("plaintext")
    const txtbox = plaintxtbox as HTMLInputElement
    txtbox.value = plaintext_hex

    let x = new TextDecoder()
    let utf8text = document.getElementById("plaintext_utf8") as HTMLInputElement
    utf8text.value = x.decode(toByteArray(plaintext_hex))
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
        navigator.serviceWorker.getRegistrations().then((registrations) => {

            for (let index = 0; index < registrations.length; index++) {
                const reg = registrations[index];
                reg.unregister
            }
        })

        const all_cache_names = await caches.keys();
        all_cache_names.forEach(cache_name => {
            caches.delete(cache_name);
        });
    })


    encrypt_btn?.addEventListener("click", () => {

        let utf8text = document.getElementById("plaintext_utf8") as HTMLInputElement
        let plaintext_box = plaintex as HTMLInputElement;
        let key_textbox = document.getElementById("key") as HTMLInputElement

        if (key_textbox.value.length != 64) {
            alert("Invalid key!")
            return
        }

        if (utf8text.value.length > 0) {
            let x = new TextEncoder()
            plaintext_box.value = toHexString(x.encode(utf8text.value))
        }

        const enc_prom = AES_Encrypt(BytesToPromise(toByteArray(plaintext_box.value)), AES_ImportKey(BytesToPromise(toByteArray(key_textbox.value))))
        enc_prom.then((x) => { AES_encrypt_callback(toHexString(x)) })
    })
    keygen_btn?.addEventListener("click", () => {
        AES_ExportKey(AES_GenerateKey()).then((key) => {

            let key_textbox = document.getElementById("key") as HTMLInputElement
            key_textbox.value = toHexString(key)
        })
    })
    decryptbtn?.addEventListener("click", () => {

        let key_textbox = document.getElementById("key") as HTMLInputElement
        let cyphertext = document.getElementById("encrypted") as HTMLInputElement

        if (key_textbox.value.length != 64) {
            alert("Invalid key!")
            return
        }
        if (cyphertext.value.length < 64) {
            alert("Invalid cyphertext!")
            return
        }
        const dec_prom = AES_Decrypt(BytesToPromise(toByteArr(cyphertext.value)), AES_ImportKey(BytesToPromise(toByteArray(key_textbox.value))))
        dec_prom.then((x) => { AES_decrypt_callback(toHexString(x)) })
    })

    const plaintext_copy_button = document.getElementById("copy_plaintext")

    const plaintext_paste_button = document.getElementById("paste_plaintext")
    plaintext_paste_button?.addEventListener("click", () => {
        let utf8text = document.getElementById("plaintext_utf8") as HTMLInputElement
        navigator.clipboard.readText().then((clipboard_text) => {
            utf8text.value = clipboard_text
        })
    })

    plaintext_copy_button?.addEventListener("click", () => {
        let utf8text = document.getElementById("plaintext_utf8") as HTMLInputElement
        navigator.clipboard.writeText(utf8text.value)
    })


    const key_copy_button = document.getElementById("copy_key")
    const key_paste_button = document.getElementById("paste_key")
    const cyphertext_copy_button = document.getElementById("copy_cyphertext")
    const cyphertext_paste_button = document.getElementById("paste_cyphertext")

    const txt_key = document.getElementById("key") as HTMLInputElement
    const txt_cypher = document.getElementById("encrypted") as HTMLInputElement

    key_copy_button?.addEventListener("click", () => {
        navigator.clipboard.writeText(txt_key.value)
    })
    key_paste_button?.addEventListener("click", () => {
        navigator.clipboard.readText().then((text_cb) => { txt_key.value = text_cb })

    })
    cyphertext_copy_button?.addEventListener("click", () => {
        navigator.clipboard.writeText(txt_cypher.value)
    })
    cyphertext_paste_button?.addEventListener("click", () => {
        navigator.clipboard.readText().then((text_cb) => { txt_cypher.value = text_cb })
    })
}

window.addEventListener("load", main)