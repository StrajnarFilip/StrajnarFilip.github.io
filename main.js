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
function AES_encrypt(hex_plaintext, hex_key) {
    var key_import = crypto.subtle.importKey("raw", toByteArray(hex_key), "AES-CBC", true, ["encrypt", "decrypt"]);
    var iv = toByteArray(AES_GenerateIV());
    key_import.then(function (key) {
        var result = window.crypto.subtle.encrypt({
            name: "AES-CBC",
            iv: iv
        }, key, toByteArray(hex_plaintext));
        result.then(function (encrypted_array) {
            var u8arr = new Uint8Array(encrypted_array);
            var hex_array_withiv = toHexString(u8arr) + toHexString(iv);
            console.log("Encrypted:\n" + hex_array_withiv);
            var enc = document.getElementById("encrypted");
            var enc_txtbox = enc;
            enc_txtbox.value = hex_array_withiv;
        });
    });
}
function AES_decrypt(hex_cyphertext, hex_key) {
    var key_import = crypto.subtle.importKey("raw", toByteArray(hex_key), "AES-CBC", true, ["encrypt", "decrypt"]);
    var cyphertext_arr = toByteArray(hex_cyphertext);
    var cyphertext = cyphertext_arr.slice(0, cyphertext_arr.length - 16);
    var iv = cyphertext_arr.slice(-16);
    console.log("IV: " + iv + ", Whole: " + cyphertext_arr + ", just ct: " + cyphertext + ", HEX CT: " + hex_cyphertext + ", HEX KEY: " + hex_key + " ");
    key_import.then(function (key) {
        var result = window.crypto.subtle.decrypt({
            name: "AES-CBC",
            iv: iv
        }, key, cyphertext);
        result.then(function (decrypted_array) {
            var u8arr = new Uint8Array(decrypted_array);
            console.log(u8arr);
            var plaintext_hex = toHexString(u8arr);
            console.log("Decrypted:\n" + plaintext_hex);
            var plaintxtbox = document.getElementById("plaintext");
            var txtbox = plaintxtbox;
            txtbox.value = plaintext_hex;
            var x = new TextDecoder();
            var utf8text = document.getElementById("plaintext_utf8");
            utf8text.value = x.decode(toByteArray(plaintext_hex));
        }).catch(function (error) { console.log(error); console.log(error.stack); console.log(error.message); console.log(error.name); });
    });
}
function AES_GenerateKey() {
    window.crypto.subtle.generateKey({
        name: "AES-CBC",
        length: 256
    }, true, ["encrypt", "decrypt"]).then(function (key) {
        crypto.subtle.exportKey("raw", key).then(function (result) {
            var exportedKeyBuffer = new Uint8Array(result);
            console.log(exportedKeyBuffer);
            console.log(toHexString(exportedKeyBuffer));
            var key_textbox = document.getElementById("key");
            key_textbox.value = toHexString(exportedKeyBuffer);
        });
    });
}
function AES_GenerateIV() {
    var random_IV = window.crypto.getRandomValues(new Uint8Array(16));
    var ivtxtbox = document.getElementById("IV");
    ivtxtbox.value = toHexString(random_IV);
    return toHexString(random_IV);
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
                case 0: return [4 /*yield*/, caches.keys()];
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
        console.log("Button clicked!");
        var utf8text = document.getElementById("plaintext_utf8");
        var plaintext_box = plaintex;
        var key_textbox = document.getElementById("key");
        if (plaintext_box.value.length > 0) {
            var x = new TextEncoder();
            plaintext_box.value = toHexString(x.encode(utf8text.value));
        }
        AES_encrypt(plaintext_box.value, key_textbox.value);
    });
    keygen_btn === null || keygen_btn === void 0 ? void 0 : keygen_btn.addEventListener("click", function () { AES_GenerateKey(); });
    decryptbtn === null || decryptbtn === void 0 ? void 0 : decryptbtn.addEventListener("click", function () {
        var key_textbox = document.getElementById("key");
        var cyphertext = document.getElementById("encrypted");
        AES_decrypt(cyphertext.value, key_textbox.value);
    });
}
window.addEventListener("load", main);
