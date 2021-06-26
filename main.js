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
function BytesToBase64(bytes) {
    var utf8decoder = new TextDecoder();
    return btoa(utf8decoder.decode(bytes)); // btoa is UTF8 -> base64
}
function Base64ToBytes(base64) {
    var utf8encoder = new TextEncoder();
    return utf8encoder.encode(atob(base64)); // atob is base64 -> UTF8
}
function AES_encrypt(plaintext, password) {
}
function AES_decrypt() {
}
function AES_GenerateKey() {
    window.crypto.subtle.generateKey({
        name: "AES-CBC",
        length: 256
    }, true, ["encrypt", "decrypt"]).then(function (key) {
        crypto.subtle.exportKey("raw", key).then(function (result) {
            var exportedKeyBuffer = new Uint8Array(result);
            console.log(exportedKeyBuffer);
            console.log(BytesToBase64(exportedKeyBuffer));
            var key_textbox = document.getElementById("key");
            key_textbox.value = BytesToBase64(exportedKeyBuffer);
        });
    });
}
function AES_GenerateIV() {
    var random_IV = window.crypto.getRandomValues(new Uint8Array(16));
    return BytesToBase64(random_IV);
}
function main() {
    var _this = this;
    var enc = document.getElementById("encrypted");
    var plaintex = document.getElementById("plaintext");
    var encrypt_btn = document.getElementById("encrypt_btn");
    var keygen_btn = document.getElementById("keygen_btn");
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
        if (enc != null) {
            var x = enc;
            x.value = "Hello";
            console.log("value set to hello");
            var y = plaintex;
            AES_encrypt(y.value, "OOF");
        }
    });
    keygen_btn === null || keygen_btn === void 0 ? void 0 : keygen_btn.addEventListener("click", function () { AES_GenerateKey(); });
}
window.addEventListener("load", main);
