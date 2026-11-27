// models/News.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);




const newsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    // required: true,
  },
  slug:{
    type:String,
    required: true,
    unique: true 
  },
  location: {
    type: String,
    // required: true,
  },
  view:{
    type: Number,
    default:0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    // required: true,
  },
  expire: {
    type: Date,
    // required: true,
  },
  description: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  youtubeurl: {
    type: String,
    // required: true,
  },
  publish: {
    type: Date,
    default: Date.now
  }
  ,
  active: {
    type: Boolean,
    default: true, // Default active state
  },
  // Editorial workflow: draft -> pending -> approved | rejected.
  // Old documents have no status and are treated as approved (see utills/newsFilter.js).
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected"],
    default: "approved",
  },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'auth' },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'auth' },
  approvedAt: Date,
  rejectReason: String,
  type: {
    type: String,
    required: true
  },
  tag: {
    type: [String],
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'auth',
    // required: true,
  },

  comments: [commentSchema],
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'auth',
  }],

},
{ timestamps: true });

// indexes for the public/staff list queries
newsSchema.index({ status: 1, publish: -1 });
newsSchema.index({ category: 1, publish: -1 });
newsSchema.index({ subcategory: 1, publish: -1 });
newsSchema.index({ type: 1, publish: -1 });
newsSchema.index({ submittedBy: 1, createdAt: -1 });

const News = mongoose.model('News', newsSchema);

module.exports = News;
