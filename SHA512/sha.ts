const btn_hash = document.getElementById("hash_btn")
const raw_text = document.getElementById("raw_text") as HTMLInputElement
const iterations = document.getElementById("iterations") as HTMLInputElement
const hashed_hex = document.getElementById("hashed_hex") as HTMLInputElement
const paste_raw = document.getElementById("paste_raw") as HTMLInputElement
const copy_hash = document.getElementById("copy_hash") as HTMLInputElement


function toHexString_(byteArray: Uint8Array): string {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
function toByteArray_(hexString: string): Uint8Array {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(result);
}

btn_hash?.addEventListener("click", () => {
    const in_bytes = BytesToPromise(new TextEncoder().encode(raw_text.value))
    const out_bytes = SHA512_times(in_bytes, Number.parseInt(iterations.value))
    console.log(`Iterations: ${Number.parseInt(iterations.value)}`);
    out_bytes.then(hashed => {
        const out_text = toHexString_(hashed)
        hashed_hex.value = out_text;
    })
})


copy_hash.addEventListener("click", () => { navigator.clipboard.writeText(hashed_hex.value) })
paste_raw.addEventListener("click", () => { navigator.clipboard.readText().then((cb_text) => { paste_raw.value = cb_text }) })