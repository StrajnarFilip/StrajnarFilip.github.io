"use strict";
var btn_hash = document.getElementById("hash_btn");
var raw_text = document.getElementById("raw_text");
var iterations = document.getElementById("iterations");
var hashed_hex = document.getElementById("hashed_hex");
var paste_raw = document.getElementById("paste_raw");
var copy_hash = document.getElementById("copy_hash");
function toHexString_(byteArray) {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
function toByteArray_(hexString) {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(result);
}
btn_hash === null || btn_hash === void 0 ? void 0 : btn_hash.addEventListener("click", function () {
    var in_bytes = BytesToPromise(new TextEncoder().encode(raw_text.value));
    var out_bytes = SHA512_times(in_bytes, Number.parseInt(iterations.value));
    console.log("Iterations: " + Number.parseInt(iterations.value));
    out_bytes.then(function (hashed) {
        var out_text = toHexString_(hashed);
        hashed_hex.value = out_text;
    });
});
copy_hash.addEventListener("click", function () { navigator.clipboard.writeText(hashed_hex.value); });
paste_raw.addEventListener("click", function () { navigator.clipboard.readText().then(function (cb_text) { paste_raw.value = cb_text; }); });
