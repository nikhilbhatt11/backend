import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //    file has been uploaded successfull
    console.log("response from clodinary filr :", response);
    console.log("file is uploaded in cloudinary", response.url);
    return response;
  } catch (error) {
    // remove the locally saved tempoary file as the upload operation get failed.
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
