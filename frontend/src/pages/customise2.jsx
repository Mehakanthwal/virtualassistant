import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";

function Customise2() {
  const {
    selectedImage,
    frontendImage,
    backendImage,
    userData,
    setUserData,
    serverUrl,
    setFrontendImage,
    setBackendImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false); // ✅ flag

  // redirect if no selected image but only if not submitting
  useEffect(() => {
    if (!submitted && !selectedImage && !frontendImage) {
      navigate("/customise");
    }
  }, [selectedImage, frontendImage, navigate, submitted]);

  // redirect if no user session
  useEffect(() => {
    if (!userData) {
      navigate("/signin");
    }
  }, [userData, navigate]);

  const handleBack = () => {
    navigate("/customise");
  };

  const handleSubmit = async () => {
    setError(null);

    if (!assistantName.trim()) {
      setError("Please enter assistant name.");
      return;
    }

    const fileToUpload = backendImage || selectedImage || null;
    if (!fileToUpload) {
      setError("No image selected. Please go back and pick an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("assistantImage", fileToUpload);
      formData.append("assistantName", assistantName);

      const res = await axios.post(`${serverUrl}/api/user/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const returnedUser = res?.data?.user ?? res?.data ?? null;
      if (returnedUser) {
        setUserData(returnedUser);
      }

      setSubmitted(true); // ✅ mark submission done
      navigate("/"); // navigate first

      // clear images after navigating
      try {
        if (frontendImage) URL.revokeObjectURL(frontendImage);
      } catch (e) {}
      setFrontendImage(null);
      setBackendImage(null);
      setSelectedImage(null);

      setLoading(false);

    } catch (err) {
      console.error("Upload failed:", err?.response ?? err);
      setError(err?.response?.data?.message || "Upload failed. Try again.");
      setLoading(false);
    }
  };

  const previewSrc = frontendImage || (typeof selectedImage === "string" ? selectedImage : null);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-[#030353] to-[#808080] flex flex-col justify-center items-center p-[20px] relative">
      <MdArrowBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={handleBack}
      />

      <h1 className="text-white text-[28px] text-center mb-6 font-semibold">
        Customise Your <span className="text-blue-400">Assistant</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-[30px] items-center">
        <div className="w-[180px] h-[260px] bg-black rounded-2xl overflow-hidden shadow-xl border border-white/40">
          {previewSrc ? (
            <img src={previewSrc} className="w-full h-full object-cover" alt="assistant" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">No preview</div>
          )}
        </div>

        <div className="flex flex-col gap-[20px] w-[280px] md:w-[320px]">
          <input
            type="text"
            placeholder="Assistant Name"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            className="p-3 rounded-xl bg-[#ffffff22] text-white border border-white/40 outline-none placeholder-gray-300"
          />

          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`w-full py-3 rounded-full text-black font-semibold text-[18px] transition
              ${!loading ? "bg-blue-500" : "bg-gray-600 cursor-not-allowed"}`}
          >
            {loading ? "Saving..." : "Finally Create Your Assistant"}
          </button>

          {error && <p className="text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Customise2;
