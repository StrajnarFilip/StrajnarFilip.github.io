"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
function toByteArray(hexString) {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(result);
}
function AES_encrypt_callback(hex_enc) {
    console.log("Encrypted:\n" + hex_enc);
    var enc = document.getElementById("encrypted");
    var enc_txtbox = enc;
    enc_txtbox.value = hex_enc;
}
function AES_decrypt_callback(plaintext_hex) {
    console.log("Decrypted:\n" + plaintext_hex);
    var plaintxtbox = document.getElementById("plaintext");
    var txtbox = plaintxtbox;
    txtbox.value = plaintext_hex;
    var x = new TextDecoder();
    var utf8text = document.getElementById("plaintext_utf8");
    utf8text.value = x.decode(toByteArray(plaintext_hex));
}
function main() {
    var _this = this;
    var plaintex = document.getElementById("plaintext");
    var encrypt_btn = document.getElementById("encrypt_btn");
    var keygen_btn = document.getElementById("keygen_btn");
    var decryptbtn = document.getElementById("decrypt_btn");
    console.log("hi");
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker allowed");
    }
    var reset = document.getElementById("reset_cache");
    reset === null || reset === void 0 ? void 0 : reset.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var all_cache_names;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    navigator.serviceWorker.getRegistrations().then(function (registrations) {
                        for (var index = 0; index < registrations.length; index++) {
                            var reg = registrations[index];
                            reg.unregister;
                        }
                    });
                    return [4 /*yield*/, caches.keys()];
                case 1:
                    all_cache_names = _a.sent();
                    all_cache_names.forEach(function (cache_name) {
                        caches.delete(cache_name);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    encrypt_btn === null || encrypt_btn === void 0 ? void 0 : encrypt_btn.addEventListener("click", function () {
        var utf8text = document.getElementById("plaintext_utf8");
        var plaintext_box = plaintex;
        var key_textbox = document.getElementById("key");
        if (key_textbox.value.length != 64) {
            alert("Invalid key!");
            return;
        }
        if (utf8text.value.length > 0) {
            var x = new TextEncoder();
            plaintext_box.value = toHexString(x.encode(utf8text.value));
        }
        var enc_prom = AES_Encrypt(BytesToPromise(toByteArray(plaintext_box.value)), AES_ImportKey(BytesToPromise(toByteArray(key_textbox.value))));
        enc_prom.then(function (x) { AES_encrypt_callback(toHexString(x)); });
    });
    keygen_btn === null || keygen_btn === void 0 ? void 0 : keygen_btn.addEventListener("click", function () {
        AES_ExportKey(AES_GenerateKey()).then(function (key) {
            var key_textbox = document.getElementById("key");
            key_textbox.value = toHexString(key);
        });
    });
    decryptbtn === null || decryptbtn === void 0 ? void 0 : decryptbtn.addEventListener("click", function () {
        var key_textbox = document.getElementById("key");
        var cyphertext = document.getElementById("encrypted");
        if (key_textbox.value.length != 64) {
            alert("Invalid key!");
            return;
        }
        if (cyphertext.value.length < 64) {
            alert("Invalid cyphertext!");
            return;
        }
        var dec_prom = AES_Decrypt(BytesToPromise(toByteArray(cyphertext.value)), AES_ImportKey(BytesToPromise(toByteArray(key_textbox.value))));
        dec_prom.then(function (x) { AES_decrypt_callback(toHexString(x)); });
    });
    var plaintext_copy_button = document.getElementById("copy_plaintext");
    var plaintext_paste_button = document.getElementById("paste_plaintext");
    plaintext_paste_button === null || plaintext_paste_button === void 0 ? void 0 : plaintext_paste_button.addEventListener("click", function () {
        var utf8text = document.getElementById("plaintext_utf8");
        navigator.clipboard.readText().then(function (clipboard_text) {
            utf8text.value = clipboard_text;
        });
    });
    plaintext_copy_button === null || plaintext_copy_button === void 0 ? void 0 : plaintext_copy_button.addEventListener("click", function () {
        var utf8text = document.getElementById("plaintext_utf8");
        navigator.clipboard.writeText(utf8text.value);
    });
    var key_copy_button = document.getElementById("copy_key");
    var key_paste_button = document.getElementById("paste_key");
    var cyphertext_copy_button = document.getElementById("copy_cyphertext");
    var cyphertext_paste_button = document.getElementById("paste_cyphertext");
    var txt_key = document.getElementById("key");
    var txt_cypher = document.getElementById("encrypted");
    key_copy_button === null || key_copy_button === void 0 ? void 0 : key_copy_button.addEventListener("click", function () {
        navigator.clipboard.writeText(txt_key.value);
    });
    key_paste_button === null || key_paste_button === void 0 ? void 0 : key_paste_button.addEventListener("click", function () {
        navigator.clipboard.readText().then(function (text_cb) { txt_key.value = text_cb; });
    });
    cyphertext_copy_button === null || cyphertext_copy_button === void 0 ? void 0 : cyphertext_copy_button.addEventListener("click", function () {
        navigator.clipboard.writeText(txt_cypher.value);
    });
    cyphertext_paste_button === null || cyphertext_paste_button === void 0 ? void 0 : cyphertext_paste_button.addEventListener("click", function () {
        navigator.clipboard.readText().then(function (text_cb) { txt_cypher.value = text_cb; });
    });
}
window.addEventListener("load", main);
