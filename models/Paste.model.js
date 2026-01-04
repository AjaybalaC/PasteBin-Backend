import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    // Expiry timestamp (null = no TTL)
    expiresAt: {
      type: Date,
      default: null
    },

    // Maximum allowed views (null = unlimited)
    maxViews: {
      type: Number,
      default: null
    },

    // Number of times the paste was accessed
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.model("Paste", pasteSchema);
