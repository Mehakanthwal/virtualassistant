// src/pages/Home.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!userData) navigate("/signin");
  }, [userData, navigate]);

  // Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      setUserData(null);
      navigate("/signin");
    }
  };

  // Main speech recognition + action loop
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return console.warn("SpeechRecognition not supported");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (err) => {
      console.error("Recognition error:", err);
      setTimeout(() => {
        try { recognition.start(); } catch {}
      }, 700);
    };

    recognition.onresult = async (e) => {
      const last = e.results[e.results.length - 1];
      const transcript = last[0].transcript.trim();
      console.log("Heard:", transcript);

      const assistantName = (userData?.assistantName || "").toLowerCase();
      if (!assistantName || !transcript.toLowerCase().includes(assistantName)) return;

      try { recognition.stop(); } catch {}

      const reply = await getGeminiResponse(transcript);
      const type = reply?.type?.trim() || "general";
      const responseText = reply?.response || "Sorry, I didn't understand that.";
      const userInput = reply?.userInput || "";

      // Speak the response first
      const utter = new SpeechSynthesisUtterance(responseText);
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find(v => v.lang.startsWith("hi"));
      if (hiVoice) utter.voice = hiVoice;

      utter.onend = () => {
        // Resume recognition after speaking
        setTimeout(() => {
          try { recognition.start(); } catch {}
        }, 200);
      };

      window.speechSynthesis.speak(utter);

      // Perform action AFTER speech starts
      switch (type) {
        case "instagram_open":
          window.open("https://www.instagram.com", "_blank");
          break;
        case "facebook_open":
          window.open("https://www.facebook.com", "_blank");
          break;
        case "youtube_search":
        case "youtube_play":
          window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, "_blank");
          break;
        case "google_search":
          window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, "_blank");
          break;
        case "calculator_open":
          window.open("https://www.online-calculator.com/full-screen-calculator/", "_blank");
          break;
        default:
          break;
      }
    };

    // Start recognition
    try { recognition.start(); } catch (e) { console.warn(e); }

    return () => {
      try { recognition.stop(); } catch {}
    };
  }, [userData, getGeminiResponse]);

  const imgSrc = userData?.assistantImage || "";

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-[#030353] to-[#808080] flex justify-center items-center flex-col gap-[15px]">
      <button
        className="min-w-[140px] h-[50px] bg-white mt-[30px] text-black text-[19px] font-semibold rounded-full absolute top-[20px] right-[20px] cursor-pointer"
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className="min-w-[160px] h-[50px] bg-white mt-[30px] text-black text-[19px] font-semibold rounded-full absolute top-[90px] right-[20px] cursor-pointer"
        onClick={() => navigate("/customise")}
      >
        Customise your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        {imgSrc ? (
          <img src={imgSrc} alt="assistant" className="h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center text-white">
            No image
          </div>
        )}
      </div>

      <h1 className="text-white text-[18px] font-bold">
        I am {userData?.assistantName || "Assistant"}
      </h1>
    </div>
  );
}

export default Home;
