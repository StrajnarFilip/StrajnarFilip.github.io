"use strict";
/*

    CryptoTS, easy TypeScript encryption library
    Copyright (C) 2021  Filip Strajnar

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/
function BytesToPromise(bytes) {
    var bytes_promise = new Promise(function (resolve, reject) {
        if (bytes instanceof Uint8Array) {
            resolve(bytes);
        }
        else {
            resolve(new Uint8Array(bytes));
        }
    });
    return bytes_promise;
}
function RSA_GenerateKey() {
    var key = window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-512",
    }, true, ["encrypt", "decrypt"]);
    return key;
}
function RSA_Encrypt(encoded_promise, key_promise) {
    var promise = new Promise(function (resolve, reject) {
        encoded_promise.then(function (encoded) {
            if (encoded.length > 512) {
                console.error("Encoded data too long! Encoded data should be limited to 512 bytes!");
            }
            key_promise.then(function (key) {
                var IV = RSA_GenerateIV();
                var ciphertext = crypto.subtle.encrypt({
                    name: "RSA-OAEP",
                    iv: IV
                }, key, encoded);
                ciphertext.then(function (ct) {
                    var encryptedData = new Uint8Array(ct);
                    var combined = new Uint8Array(encryptedData.length + IV.length);
                    var count_enc = 0;
                    while (count_enc < encryptedData.length) {
                        combined[count_enc] = encryptedData[count_enc];
                        count_enc++;
                    }
                    var count_IV = 0;
                    while (count_IV < IV.length) {
                        combined[count_enc + count_IV] = IV[count_IV];
                        count_IV++;
                    }
                    resolve(combined);
                });
            });
        });
    });
    return promise;
}
function RSA_Decrypt(encoded_promise, key_promise) {
    var promise = new Promise(function (resolve, reject) {
        encoded_promise.then(function (encoded) {
            key_promise.then(function (key) {
                var data = encoded.slice(0, (encoded.length - 16));
                var IV = encoded.slice(-16);
                var decrypted_promise = crypto.subtle.decrypt({
                    name: "RSA-OAEP",
                    iv: IV
                }, key, data);
                decrypted_promise.then(function (array_data) {
                    var bytes_data = new Uint8Array(array_data);
                    resolve(bytes_data);
                });
            });
        });
    });
    return promise;
}
function RSA_GenerateIV() {
    return window.crypto.getRandomValues(new Uint8Array(16));
}
function RSA_GetPublicKey(key_promise) {
    var promise = new Promise(function (resolve, reject) {
        key_promise.then(function (key) {
            if (key.publicKey != undefined) {
                resolve(key.publicKey);
            }
        });
    });
    return promise;
}
function RSA_GetPrivateKey(key_promise) {
    var promise = new Promise(function (resolve, reject) {
        key_promise.then(function (key) {
            if (key.privateKey != undefined) {
                resolve(key.privateKey);
            }
        });
    });
    return promise;
}
function RSA_ExportPublicKey(key_promise) {
    var promise = new Promise(function (resolve, reject) {
        key_promise.then(function (key) {
            if (key.publicKey == undefined) {
                return;
            }
            crypto.subtle.exportKey("spki", key.publicKey)
                .then(function (key_jwk) {
                resolve(new Uint8Array(key_jwk));
            });
        });
    });
    return promise;
}
function RSA_ExportPrivateKey(key_promise) {
    var promise = new Promise(function (resolve, reject) {
        key_promise.then(function (key) {
            if (key.privateKey == undefined) {
                return;
            }
            crypto.subtle.exportKey("pkcs8", key.privateKey)
                .then(function (key_jwk) {
                resolve(new Uint8Array(key_jwk));
            });
        });
    });
    return promise;
}
function RSA_ImportPublicKey(key_promise) {
    var promise = new Promise(function (resolve, reject) {
        key_promise.then(function (key_spki) {
            var key = crypto.subtle.importKey("spki", key_spki, {
                name: "RSA-OAEP",
                hash: "SHA-512"
            }, true, ["encrypt"]);
            key.then(function (crypto_key) {
                resolve(crypto_key);
            });
        });
    });
    return promise;
}
function RSA_ImportPrivateKey(key_promise) {
    var promise = new Promise(function (resolve, reject) {
        key_promise.then(function (key_pkcs8) {
            var key = crypto.subtle.importKey("pkcs8", key_pkcs8, {
                name: "RSA-OAEP",
                hash: "SHA-512"
            }, true, ["unwrapKey", "decrypt"]);
            key.then(function (crypto_key) {
                resolve(crypto_key);
            });
        });
    });
    return promise;
}
function AES_GenerateKey() {
    return window.crypto.subtle.generateKey({
        name: "AES-CBC",
        length: 256
    }, true, ["encrypt", "decrypt"]);
}
function AES_GenerateIV() {
    return window.crypto.getRandomValues(new Uint8Array(16));
}
function AES_ExportKey(key_promise) {
    var exported_key_promise = new Promise(function (resolve, reject) {
        key_promise.then(function (key) {
            crypto.subtle.exportKey("raw", key).then(function (key_buffer) {
                resolve(new Uint8Array(key_buffer));
            });
        });
    });
    return exported_key_promise;
}
function AES_ImportKey(raw_key_promise) {
    var imported_promise = new Promise(function (resolve, reject) {
        raw_key_promise.then(function (raw_key) {
            resolve(crypto.subtle.importKey("raw", raw_key, "AES-CBC", true, ["encrypt", "decrypt"]));
        });
    });
    return imported_promise;
}
function AES_Encrypt(data_to_encrypt_promise, key_promise) {
    var IV = AES_GenerateIV();
    var data_promise = new Promise(function (resolve, reject) {
        key_promise.then(function (key) {
            data_to_encrypt_promise.then(function (data_to_encrypt) {
                crypto.subtle.encrypt({
                    name: "AES-CBC",
                    iv: IV
                }, key, data_to_encrypt)
                    .then(function (encryped) {
                    var encryptedData = new Uint8Array(encryped);
                    var combined = new Uint8Array(encryptedData.length + IV.length);
                    var count_enc = 0;
                    while (count_enc < encryptedData.length) {
                        combined[count_enc] = encryptedData[count_enc];
                        count_enc++;
                    }
                    var count_IV = 0;
                    while (count_IV < IV.length) {
                        combined[count_enc + count_IV] = IV[count_IV];
                        count_IV++;
                    }
                    resolve(combined);
                });
            });
        });
    });
    return data_promise;
}
function AES_Decrypt(encrypted_data, key_promise) {
    var data_promise = new Promise(function (resolve, reject) {
        encrypted_data.then(function (encrypted) {
            var IV = encrypted.slice(-16);
            var cyphertext = encrypted.slice(0, (encrypted.length - 16));
            key_promise.then(function (key) {
                crypto.subtle.decrypt({
                    name: "AES-CBC",
                    iv: IV
                }, key, cyphertext).then(function (decrypted) {
                    resolve(new Uint8Array(decrypted));
                });
            });
        });
    });
    return data_promise;
}
function SHA512(data_promise) {
    var promise = new Promise(function (resolve, reject) {
        data_promise.then(function (data) {
            var result = crypto.subtle.digest("SHA-512", data);
            result.then(function (buffer) { resolve(new Uint8Array(buffer)); });
        });
    });
    return promise;
}
function SHA512_times(data, iterations) {
    var promise = new Promise(function (resolve, reject) {
        var changing_promise = data;
        for (var index = 0; index < iterations; index++) {
            changing_promise = SHA512(changing_promise);
        }
        resolve(changing_promise);
    });
    return promise;
}
var AES_Safe = /** @class */ (function () {
    function AES_Safe() {
        this.key = AES_GenerateKey();
        this.cipher_data = BytesToPromise(new Uint8Array());
        this.plain_data = BytesToPromise(new Uint8Array());
    }
    AES_Safe.prototype.SetByteKey = function (new_key) {
        if (new_key instanceof Uint8Array) {
            this.key = AES_ImportKey(BytesToPromise(new_key));
        }
        if (new_key instanceof Promise) {
            this.key = AES_ImportKey(new_key);
        }
    };
    AES_Safe.prototype.GetCryptoKey = function (callback) {
        this.key.then(function (promised_key) { callback(promised_key); });
        return this.key;
    };
    AES_Safe.prototype.GetByteKey = function (callback) {
        AES_ExportKey(this.key).then(function (key) { callback(key); });
    };
    AES_Safe.prototype.Encrypt = function (bytes) {
        if (typeof (bytes) === "string") {
            var enc_1 = new TextEncoder();
            this.plain_data = BytesToPromise(enc_1.encode(bytes));
        }
        if (bytes instanceof Uint8Array) {
            this.plain_data = BytesToPromise(bytes);
        }
        this.cipher_data = AES_Encrypt(this.plain_data, this.key);
        return this.cipher_data;
    };
    AES_Safe.prototype.Decrypt = function (callback) {
        this.plain_data = AES_Decrypt(this.cipher_data, this.key);
        if (typeof (callback) != "undefined") {
            this.plain_data.then(function (plain) { callback(plain); });
        }
        return this.plain_data;
    };
    AES_Safe.prototype.DecryptString = function (callback) {
        this.plain_data = AES_Decrypt(this.cipher_data, this.key);
        this.plain_data.then(function (data) { var decoded = new TextDecoder().decode(data); callback(decoded); });
    };
    return AES_Safe;
}());
