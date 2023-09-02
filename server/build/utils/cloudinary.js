import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOURNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
    secure: true,
});
export async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: 'auto',
    });
    return res;
}
//# sourceMappingURL=cloudinary.js.map