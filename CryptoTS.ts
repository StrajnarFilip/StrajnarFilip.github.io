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

function BytesToPromise(bytes: Uint8Array | Array<number>) {

    const bytes_promise: Promise<Uint8Array> = new Promise((resolve, reject) => {
        if (bytes instanceof Uint8Array) {
            resolve(bytes)
        }
        else {
            resolve(new Uint8Array(bytes))
        }
    });
    return bytes_promise;
}

function RSA_GenerateKey(): Promise<CryptoKeyPair> {
    const key = window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-512",
        },
        true,
        ["encrypt", "decrypt"]
    )
    return key;
}

function RSA_Encrypt(encoded_promise: Promise<Uint8Array>, key_promise: Promise<CryptoKey>) {
    const promise: Promise<Uint8Array> = new Promise((resolve, reject) => {
        encoded_promise.then((encoded) => {
            if (encoded.length > 512) { console.error("Encoded data too long! Encoded data should be limited to 512 bytes!"); }
            key_promise.then((key) => {
                const IV = RSA_GenerateIV()
                const ciphertext = crypto.subtle.encrypt(
                    {
                        name: "RSA-OAEP",
                        iv: IV
                    },
                    key,
                    encoded
                );
                ciphertext.then((ct) => {
                    const encryptedData = new Uint8Array(ct)
                    const combined = new Uint8Array(encryptedData.length + IV.length)

                    let count_enc = 0
                    while (count_enc < encryptedData.length) {
                        combined[count_enc] = encryptedData[count_enc]
                        count_enc++
                    }

                    let count_IV = 0
                    while (count_IV < IV.length) {
                        combined[count_enc + count_IV] = IV[count_IV]
                        count_IV++
                    }
                    resolve(combined)
                })
            }
            )
        })
    })
    return promise;
}


function RSA_Decrypt(encoded_promise: Promise<Uint8Array>, key_promise: Promise<CryptoKey>) {
    const promise: Promise<Uint8Array> = new Promise((resolve, reject) => {
        encoded_promise.then((encoded) => {
            key_promise.then((key) => {
                const data = encoded.slice(0, (encoded.length - 16))
                const IV = encoded.slice(-16)
                const decrypted_promise = crypto.subtle.decrypt(
                    {
                        name: "RSA-OAEP",
                        iv: IV
                    },
                    key,
                    data
                );
                decrypted_promise.then((array_data) => {
                    const bytes_data = new Uint8Array(array_data)
                    resolve(bytes_data)
                })
            })
        })
    })
    return promise;
}

function RSA_GenerateIV() {
    return window.crypto.getRandomValues(new Uint8Array(16))
}

function RSA_GetPublicKey(key_promise: Promise<CryptoKeyPair>) {
    const promise: Promise<CryptoKey> = new Promise((resolve, reject) => {
        key_promise.then((key) => {
            if (key.publicKey != undefined) {
                resolve(key.publicKey)
            }
        })
    })
    return promise;
}

function RSA_GetPrivateKey(key_promise: Promise<CryptoKeyPair>) {
    const promise: Promise<CryptoKey> = new Promise((resolve, reject) => {
        key_promise.then((key) => {
            if (key.privateKey != undefined) {
                resolve(key.privateKey)
            }
        })
    })
    return promise;
}

function RSA_ExportPublicKey(key_promise: Promise<CryptoKeyPair>) {
    const promise: Promise<Uint8Array> = new Promise((resolve, reject) => {
        key_promise.then((key) => {
            if (key.publicKey == undefined) { return }
            crypto.subtle.exportKey("spki", key.publicKey)
                .then((key_jwk) => {
                    resolve(new Uint8Array(key_jwk))
                })
        })
    })
    return promise;
}

function RSA_ExportPrivateKey(key_promise: Promise<CryptoKeyPair>) {
    const promise: Promise<Uint8Array> = new Promise((resolve, reject) => {
        key_promise.then((key) => {
            if (key.privateKey == undefined) { return }
            crypto.subtle.exportKey("pkcs8", key.privateKey)
                .then((key_jwk) => {
                    resolve(new Uint8Array(key_jwk))
                })
        })
    })
    return promise;
}

function RSA_ImportPublicKey(key_promise: Promise<Uint8Array>) {
    const promise: Promise<CryptoKey> = new Promise((resolve, reject) => {
        key_promise.then((key_spki) => {
            const key = crypto.subtle.importKey("spki", key_spki, {
                name: "RSA-OAEP",
                hash: "SHA-512"
            }, true, ["encrypt"])
            key.then((crypto_key) => {
                resolve(crypto_key)
            })

        })
    })
    return promise;
}

function RSA_ImportPrivateKey(key_promise: Promise<Uint8Array>) {
    const promise: Promise<CryptoKey> = new Promise((resolve, reject) => {
        key_promise.then((key_pkcs8) => {
            const key = crypto.subtle.importKey("pkcs8", key_pkcs8, {
                name: "RSA-OAEP",
                hash: "SHA-512"
            }, true, ["unwrapKey", "decrypt"])
            key.then((crypto_key) => {
                resolve(crypto_key)
            })

        })
    })
    return promise;
}


function AES_GenerateKey() {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    )
}

function AES_GenerateIV() {
    return window.crypto.getRandomValues(new Uint8Array(16))
}

function AES_ExportKey(key_promise: Promise<CryptoKey>): Promise<Uint8Array> {
    const exported_key_promise: Promise<Uint8Array> = new Promise((resolve, reject) => {
        key_promise.then((key) => {
            crypto.subtle.exportKey("raw", key).then((key_buffer) => {
                resolve(new Uint8Array(key_buffer))
            })
        })
    });
    return exported_key_promise;
}


function AES_ImportKey(raw_key_promise: Promise<Uint8Array>): Promise<CryptoKey> {
    const imported_promise: Promise<CryptoKey> = new Promise((resolve, reject) => {
        raw_key_promise.then((raw_key) => {
            resolve(crypto.subtle.importKey("raw", raw_key, "AES-CBC", true, ["encrypt", "decrypt"]));
        });
    });
    return imported_promise;
}

function AES_Encrypt(data_to_encrypt_promise: Promise<Uint8Array>, key_promise: Promise<CryptoKey>) {
    const IV = AES_GenerateIV()

    const data_promise: Promise<Uint8Array> = new Promise((resolve, reject) => {
        key_promise.then((key) => {
            data_to_encrypt_promise.then((data_to_encrypt) => {
                crypto.subtle.encrypt(
                    {
                        name: "AES-CBC",
                        iv: IV
                    },
                    key,
                    data_to_encrypt
                )
                    .then((encryped) => {
                        const encryptedData = new Uint8Array(encryped)
                        const combined = new Uint8Array(encryptedData.length + IV.length)

                        let count_enc = 0
                        while (count_enc < encryptedData.length) {
                            combined[count_enc] = encryptedData[count_enc]
                            count_enc++
                        }

                        let count_IV = 0
                        while (count_IV < IV.length) {
                            combined[count_enc + count_IV] = IV[count_IV]
                            count_IV++
                        }
                        resolve(combined)
                    })
            });
        });
    });
    return data_promise;
}


function AES_Decrypt(encrypted_data: Promise<Uint8Array>, key_promise: Promise<CryptoKey>) {
    const data_promise: Promise<Uint8Array> = new Promise((resolve, reject) => {
        encrypted_data.then((encrypted) => {
            const IV = encrypted.slice(-16)
            const cyphertext = encrypted.slice(0, (encrypted.length - 16))
            key_promise.then((key) => {
                crypto.subtle.decrypt(
                    {
                        name: "AES-CBC",
                        iv: IV
                    },
                    key,
                    cyphertext
                ).then((decrypted) => {
                    resolve(new Uint8Array(decrypted))
                })
            })
        });
    });
    return data_promise;
}

class AES_Safe {
    public key: Promise<CryptoKey> = AES_GenerateKey()
    public cipher_data: Promise<Uint8Array> = BytesToPromise(new Uint8Array())
    public plain_data: Promise<Uint8Array> = BytesToPromise(new Uint8Array())
    constructor() {

    }
    public SetByteKey(new_key: Uint8Array | Promise<Uint8Array>) {
        if (new_key instanceof Uint8Array) {
            this.key = AES_ImportKey(BytesToPromise(new_key))
        }
        if (new_key instanceof Promise) {
            this.key = AES_ImportKey(new_key)
        }
    }
    public GetCryptoKey(callback: (key_object: CryptoKey) => void) {
        this.key.then((promised_key) => { callback(promised_key) })
        return this.key
    }

    public GetByteKey(callback: (key: Uint8Array) => void) {
        AES_ExportKey(this.key).then((key) => { callback(key) })
    }

    public Encrypt(bytes?: Uint8Array | string) {
        if (typeof (bytes) === "string") {
            const enc = new TextEncoder()
            this.plain_data = BytesToPromise(enc.encode(bytes))
        }
        if (bytes instanceof Uint8Array) {
            this.plain_data = BytesToPromise(bytes)
        }
        this.cipher_data = AES_Encrypt(this.plain_data, this.key)
        return this.cipher_data
    }

    public Decrypt(callback?: (decrypted: Uint8Array) => void): Promise<Uint8Array> {
        this.plain_data = AES_Decrypt(this.cipher_data, this.key)
        if (typeof (callback) != "undefined") {
            this.plain_data.then((plain) => { callback(plain) })
        }
        return this.plain_data
    }

    public DecryptString(callback: (decrypted: string) => void) {
        this.plain_data = AES_Decrypt(this.cipher_data, this.key)
        this.plain_data.then((data) => { const decoded = new TextDecoder().decode(data); callback(decoded) })
    }
}
