import dotenv from "dotenv";
dotenv.config(); 
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (fileBuffer) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "assistant_images" }, // ✅ Optional folder
        (error, result) => {
          if (error) {
            console.error("❗ Cloudinary error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(stream); // ✅ Correct way to stream buffer
    });

    return result.secure_url;
  } catch (error) {
    console.error("❗ Cloudinary upload error:", error);
    throw error;
  }
};