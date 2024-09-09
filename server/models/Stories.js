// models/News.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
    title: [{
        type: String,
        required: true,
    }],
    author: {
        type: String,
        required: true,
    },

    images: [
        {
            public_id: String,
            url: String,
        },
    ],


},
    { timestamps: true });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
