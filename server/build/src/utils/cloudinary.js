"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpload = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOURNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
    secure: true,
});
async function handleUpload(file) {
    const res = await cloudinary_1.v2.uploader.upload(file, {
        resource_type: 'auto',
    });
    return res;
}
exports.handleUpload = handleUpload;
//# sourceMappingURL=cloudinary.js.map