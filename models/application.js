const mongoose = require('mongoose');

// Define the question schema
const questionSchema = mongoose.Schema(
  {
    question: { type: String, required: true },
    ans: { type: String },
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Define the application schema
const applicationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    isReturned: {
      type: Boolean,
      required: true,
      default: false,
    },
    returnedAt: {
      type: Date,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
