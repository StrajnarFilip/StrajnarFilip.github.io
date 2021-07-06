const btn_keygen = document.getElementById("keygen_btn")
const btn_encrypt = document.getElementById("encrypt_btn")
const btn_decrypt = document.getElementById("decrypt_btn")

const dec = new TextDecoder()
const enc = new TextEncoder()

function toHexStr(byteArray: Uint8Array): string {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
function toByteArr(hexString: string): Uint8Array {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(result);
}

function TextBoxBuilder(label_name: string, append_to_id: string) {
    const master_div = document.createElement("div")
    const label = document.createElement("label")
    label.innerHTML = label_name

    const textbox = document.createElement("input")
    textbox.classList.add("form-control")
    textbox.type = "text"

    const tb_div = document.createElement("div")
    tb_div.classList.add("input-group")

    const copy_btn = document.createElement("button")
    copy_btn.innerHTML = "Copy"
    copy_btn.classList.add("btn")
    copy_btn.classList.add("btn-outline-secondary")
    copy_btn.type = "button"
    copy_btn.addEventListener("click", () => { navigator.clipboard.writeText(textbox.value) })

    const paste_btn = document.createElement("button")
    paste_btn.innerHTML = "Paste"
    paste_btn.classList.add("btn")
    paste_btn.classList.add("btn-outline-secondary")
    paste_btn.type = "button"
    paste_btn.addEventListener("click", () => { navigator.clipboard.readText().then((cb_text) => { textbox.value = cb_text }) })


    tb_div.appendChild(copy_btn)
    tb_div.appendChild(paste_btn)
    tb_div.appendChild(textbox)

    master_div.appendChild(label)
    master_div.appendChild(tb_div)

    document.getElementById(append_to_id)?.appendChild(master_div)

    return textbox;
}

function main_rsa() {
    const txtbx_ciphertext = TextBoxBuilder("Ciphertext", "root")
    const txtbx_privkey = TextBoxBuilder("Private key", "root")
    const txtbx_pubkey = TextBoxBuilder("Public key", "root")
    const txtbx_plaintext = TextBoxBuilder("Hexadecimal plaintext", "root")
    const txtbx_UTF8 = TextBoxBuilder("Regular plaintext", "root")

    btn_keygen?.addEventListener("click", () => {
        const key_promise = RSA_GenerateKey()
        RSA_ExportPrivateKey(key_promise).then((key) => { txtbx_privkey.value = toHexStr(key) })
        RSA_ExportPublicKey(key_promise).then((key) => { txtbx_pubkey.value = toHexStr(key) })
    })

    btn_encrypt?.addEventListener("click", () => {
        const imported_promise = RSA_ImportPublicKey(BytesToPromise(toByteArr(txtbx_pubkey.value)))

        if (txtbx_UTF8.value.length > 0 && txtbx_UTF8.value.length < 512) {
            txtbx_plaintext.value = toHexStr(enc.encode(txtbx_UTF8.value))
        }
        if (txtbx_plaintext.value.length <= 1024) {
            RSA_Encrypt(BytesToPromise(toByteArr(txtbx_plaintext.value)), imported_promise).then((encrypted) => { txtbx_ciphertext.value = toHexStr(encrypted) })
        } else {
            alert("Plaintext too large! Limited to 1024 hexadecimal characters")
        }
    })
    btn_decrypt?.addEventListener("click", () => {
        const imported_promise = RSA_ImportPrivateKey(BytesToPromise(toByteArr(txtbx_privkey.value)))
        if (txtbx_ciphertext.value.length <= 1056) {
            RSA_Decrypt(BytesToPromise(toByteArr(txtbx_ciphertext.value)), imported_promise).then((decrypted) => {
                txtbx_plaintext.value = toHexStr(decrypted)
                txtbx_UTF8.value = dec.decode(decrypted)
            })
        } else {
            alert("Ciphertext too large! Limited to 1024 hexadecimal characters")
        }

    })
    console.log("Loaded");

}

main_rsa()