const { uploadImageToCloudinary } = require("../config/imageUploader");
const adsModel = require("../models/adsModel")

const createAddCtrl = async (req, res) => {
    try {
        const { url, type, imageUrl, title, startsAt, endsAt } = req.body;
        const image = req.files && req.files.image;

        if (!url || !type || (!image && !imageUrl)) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            })
        }

        // either an uploaded file (Cloudinary) or a direct image link
        const imageLink = image
            ? (await uploadImageToCloudinary(image, process.env.FOLDER_NAME)).secure_url
            : imageUrl;

        const ad = await adsModel.create({
            title,
            startsAt: startsAt ? new Date(startsAt) : undefined,
            endsAt: endsAt ? new Date(endsAt) : undefined,
            image: imageLink,
            url,
            type
        })
        return res.status(201).json({
            success: true,
            message: "Ads created successfully!",
            ad
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in createing ads api!"
        })
    }
}

// Public: only ads that are switched on and inside their date window.
const getAllAds = async (req, res) => {
    try {
        const now = new Date();
        const ads = await adsModel.find({
            active: { $ne: false },
            $and: [
                { $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }] },
                { $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }] },
            ],
        });
        return res.status(200).json({ success: true, ads });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in getting ads api!" });
    }
}

// Staff: every ad with its status (for the admin panel).
const getAdminAds = async (req, res) => {
    try {
        const ads = await adsModel.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, ads });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const updateAdCtrl = async (req, res) => {
    try {
        const { title, url, type, active, startsAt, endsAt } = req.body;
        const patch = {};
        if (title !== undefined) patch.title = title;
        if (url !== undefined) patch.url = url;
        if (type !== undefined) patch.type = type;
        if (typeof active === "boolean") patch.active = active;
        if (startsAt !== undefined) patch.startsAt = startsAt ? new Date(startsAt) : null;
        if (endsAt !== undefined) patch.endsAt = endsAt ? new Date(endsAt) : null;
        const ad = await adsModel.findByIdAndUpdate(req.params.id, patch, { new: true });
        if (!ad) return res.status(404).json({ success: false, message: "Ad not found" });
        return res.status(200).json({ success: true, ad });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const clickAdCtrl = async (req, res) => {
    try {
        await adsModel.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(200).json({ success: false });
    }
}

const deleteAddCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        await adsModel.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Ad delete successfully!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in deleting ads api!"
        })
    }
}

module.exports = { createAddCtrl, getAllAds, deleteAddCtrl, getAdminAds, updateAdCtrl, clickAdCtrl }