const ENDPOINT = "/api";
const salt = 15;
const dest = "/uploads";
const expireToken = "5h";
const secretKeyToken = "GhdkPo5A2";
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

module.exports = {
    ENDPOINT,
    salt,
    dest,
    expireToken,
    secretKeyToken,
    MIME_TYPES
};