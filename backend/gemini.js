import axios from "axios";

const gemeniResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

    const promptText = `You are a virtual assistant named ${assistantName} created by ${userName}.
You will respond in JSON format like:
{
"type": "general" | "google_search" | "youtube_search" | "youtube_play" |
"get_time" | "get_date" | "get_month" | "calculator_open" |
"instagram_open" | "facebook_open" | "weather_show",
"userInput": "<original user input>",
"response": "<short spoken response>"
}
Respond only with JSON. User input: ${command}`;

    const result = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: promptText }] }],
    });

    return result.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log(error);
    return JSON.stringify({ type: "general", userInput: command, response: "Sorry, I can't respond now." });
  }
};

export default gemeniResponse;
