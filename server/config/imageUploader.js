const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder) => {
  const options = {
    folder,
    resource_type: "auto", // Automatically detect resource type
    transformation: [
      { width: 1200, crop: "scale" }, // Hardcoded width
      { quality: 75 } // Hardcoded quality
    ]
  };

  // Upload the image
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};