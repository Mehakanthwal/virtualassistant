import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // FIXED FIELD NAMES (matching controller & frontend)
    assistantName: {
      type: String,
      default: null,
    },

    assistantImage: {
      type: String,
      default: null,
    },

    history: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
