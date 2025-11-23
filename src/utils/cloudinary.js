import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded to cloudinary, now we can remove it from local storage
    console.log("file is uploaded on cloudinary".response.url);
    return response;
  } catch (error) {
    try {
      if (localFilePath && fs.existsSync(localFilePath))
        fs.unlinkSync(localFilePath);
    } catch (e) {
      // ignore unlink errors
    }
    return null;
  }
};

export { uploadToCloudinary };
