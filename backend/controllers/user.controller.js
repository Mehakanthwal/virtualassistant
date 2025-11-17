import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import gemeniResponse from "../gemini.js";
import moment from "moment/moment.js";

// ✅ Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("❗ Error fetching current user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update assistant info
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName } = req.body;
    let assistantImage;

    console.log("Received userId:", req.userId);
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    // Handle image upload
    if (req.file && req.file.buffer) {
      try {
        assistantImage = await uploadOnCloudinary(req.file.buffer);
      } catch (cloudError) {
        console.error("❗ Cloudinary upload failed:", cloudError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    } else {
      return res.status(400).json({ message: "No image provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Failed to update assistant" });
  }
};

// ✅ Ask assistant (Gemini)
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ response: "User not found" });

    const userName = user.name;
    const assistantName = user.assistantName || "Assistant";

    const result = await gemeniResponse(command, assistantName, userName);

    // Extract JSON from response
    const jsonMatch = result?.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand that." });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch (type.trim()) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current day is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      default:
        return res.status(400).json({
          response: "Sorry, I didn't understand that command.",
        });
    }
  } catch (error) {
    console.error("Ask assistant error:", error);
    return res.status(500).json({ response: "Sorry, assistant error." });
  }
};
