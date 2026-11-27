const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming image URL for simplicity
    // required: true,
  },
  subCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'SubCategory'
  }],
  news: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
    },
  ],



  active: {
    type: Boolean,
    default: true, // Default active state
  },
  // "division" = a Madhya Pradesh संभाग (its sub-categories are the districts); "topic" = normal category.
  kind: {
    type: String,
    enum: ["topic", "division"],
    default: "topic",
  },
  order: {
    type: Number,
    default: 0,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
