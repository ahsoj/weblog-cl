import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOURNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

export function uploadImage(imageUploaded: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUploaded,
      { width: 900, height: 384, crop: 'fill' },
      (err: any, res: unknown) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}
