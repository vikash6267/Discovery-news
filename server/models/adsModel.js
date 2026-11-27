const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
            trim: true,
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            required: true,
        },

        title: { type: String, trim: true },
        active: { type: Boolean, default: true },
        startsAt: Date,
        endsAt: Date,
        clicks: { type: Number, default: 0 },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Ads", adsSchema);