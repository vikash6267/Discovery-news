const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder) => {
  const options = {
    folder,
    resource_type: "auto",
    transformation: [
      { width: 900, height: 530, crop: "fit" },
      { quality: 60 },

    ],
    format: "jpg"  // Convert the image to JPG format
  };


  // Upload the image
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
