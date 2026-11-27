const { uploadImage } = require("../config/imageUploader");

// Single image: field name "thumbnail"
exports.imageUpload = async (req, res) => {
  try {
    const thumbnail = req.files && req.files.thumbnail;
    if (!thumbnail || Array.isArray(thumbnail)) {
      return res.status(400).json({ success: false, message: "Send one image in the field 'thumbnail'" });
    }
    const thumbnailImage = await uploadImage(thumbnail);
    res.status(200).json({ success: true, message: "Image upload successfully", thumbnailImage });
  } catch (error) {
    console.error("Image upload error:", error.message);
    res.status(500).json({ success: false, message: error.message || "Image upload failed" });
  }
};

// One or many images: field name "thumbnail" (repeat the field for several files)
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || !req.files.thumbnail) {
      return res.status(400).json({ success: false, message: "No files were uploaded." });
    }
    const files = Array.isArray(req.files.thumbnail) ? req.files.thumbnail : [req.files.thumbnail];
    const images = [];
    for (const file of files) {
      images.push(await uploadImage(file));
    }
    res.status(200).json({ success: true, message: "Images uploaded successfully", images });
  } catch (error) {
    console.error("Image upload error:", error.message);
    res.status(500).json({ success: false, message: error.message || "Image upload failed" });
  }
};
