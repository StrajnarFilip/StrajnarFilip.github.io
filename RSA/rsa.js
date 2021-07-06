"use strict";
var btn_keygen = document.getElementById("keygen_btn");
var btn_encrypt = document.getElementById("encrypt_btn");
var btn_decrypt = document.getElementById("decrypt_btn");
var dec = new TextDecoder();
var enc = new TextEncoder();
function toHexStr(byteArray) {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
function toByteArr(hexString) {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(result);
}
function TextBoxBuilder(label_name, append_to_id) {
    var _a;
    var master_div = document.createElement("div");
    var label = document.createElement("label");
    label.innerHTML = label_name;
    var textbox = document.createElement("input");
    textbox.classList.add("form-control");
    textbox.type = "text";
    var tb_div = document.createElement("div");
    tb_div.classList.add("input-group");
    var copy_btn = document.createElement("button");
    copy_btn.innerHTML = "Copy";
    copy_btn.classList.add("btn");
    copy_btn.classList.add("btn-outline-secondary");
    copy_btn.type = "button";
    copy_btn.addEventListener("click", function () { navigator.clipboard.writeText(textbox.value); });
    var paste_btn = document.createElement("button");
    paste_btn.innerHTML = "Paste";
    paste_btn.classList.add("btn");
    paste_btn.classList.add("btn-outline-secondary");
    paste_btn.type = "button";
    paste_btn.addEventListener("click", function () { navigator.clipboard.readText().then(function (cb_text) { textbox.value = cb_text; }); });
    tb_div.appendChild(copy_btn);
    tb_div.appendChild(paste_btn);
    tb_div.appendChild(textbox);
    master_div.appendChild(label);
    master_div.appendChild(tb_div);
    (_a = document.getElementById(append_to_id)) === null || _a === void 0 ? void 0 : _a.appendChild(master_div);
    return textbox;
}
function main_rsa() {
    var txtbx_ciphertext = TextBoxBuilder("Ciphertext", "root");
    var txtbx_privkey = TextBoxBuilder("Private key", "root");
    var txtbx_pubkey = TextBoxBuilder("Public key", "root");
    var txtbx_plaintext = TextBoxBuilder("Hexadecimal plaintext", "root");
    var txtbx_UTF8 = TextBoxBuilder("Regular plaintext", "root");
    btn_keygen === null || btn_keygen === void 0 ? void 0 : btn_keygen.addEventListener("click", function () {
        var key_promise = RSA_GenerateKey();
        RSA_ExportPrivateKey(key_promise).then(function (key) { txtbx_privkey.value = toHexStr(key); });
        RSA_ExportPublicKey(key_promise).then(function (key) { txtbx_pubkey.value = toHexStr(key); });
    });
    btn_encrypt === null || btn_encrypt === void 0 ? void 0 : btn_encrypt.addEventListener("click", function () {
        var imported_promise = RSA_ImportPublicKey(BytesToPromise(toByteArr(txtbx_pubkey.value)));
        if (txtbx_UTF8.value.length > 0 && txtbx_UTF8.value.length < 512) {
            txtbx_plaintext.value = toHexStr(enc.encode(txtbx_UTF8.value));
        }
        if (txtbx_plaintext.value.length <= 1024) {
            RSA_Encrypt(BytesToPromise(toByteArr(txtbx_plaintext.value)), imported_promise).then(function (encrypted) { txtbx_ciphertext.value = toHexStr(encrypted); });
        }
        else {
            alert("Plaintext too large! Limited to 1024 hexadecimal characters");
        }
    });
    btn_decrypt === null || btn_decrypt === void 0 ? void 0 : btn_decrypt.addEventListener("click", function () {
        var imported_promise = RSA_ImportPrivateKey(BytesToPromise(toByteArr(txtbx_privkey.value)));
        if (txtbx_ciphertext.value.length <= 1056) {
            RSA_Decrypt(BytesToPromise(toByteArr(txtbx_ciphertext.value)), imported_promise).then(function (decrypted) {
                txtbx_plaintext.value = toHexStr(decrypted);
                txtbx_UTF8.value = dec.decode(decrypted);
            });
        }
        else {
            alert("Ciphertext too large! Limited to 1024 hexadecimal characters");
        }
    });
    console.log("Loaded");
}
main_rsa();
