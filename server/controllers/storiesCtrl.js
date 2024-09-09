const storyModel = require("../models/Stories")

const createStoryCtrl = async (req, res) => {
    try {
        const { title, author, images } = req.body;
        const imageArray = typeof images === 'string' ? JSON.parse(images) : images;
        const titleArray = typeof title === 'string' ? JSON.parse(title) : title;
        console.log(req.body)
        if (!title || !author || !imageArray) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All fields"
            })
        }
        const story = await storyModel.create({
            title: titleArray, author, images: imageArray
        })

        return res.status(201).json({
            success: true,
            message: "Story created successfully!",
            story
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in creating story",
            success: false
        })
    }
}

const getAllStoryCtrl = async (req, res) => {
    try {
        const stories = await storyModel.find({});
        return res.status(200).json({
            success: true,
            stories
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in getting all  stories",
            success: false
        })
    }
}
module.exports = { createStoryCtrl, getAllStoryCtrl }