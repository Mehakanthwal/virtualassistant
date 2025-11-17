// src/pages/Customise.jsx
import React, { useContext, useEffect, useRef } from "react";
import Card from "../components/card.jsx";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import { LuImagePlus } from "react-icons/lu";
import { UserDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

function Customise() {
  const {
    userData,
    setFrontendImage,
    setBackendImage,
    setSelectedImage,
    frontendImage,
    selectedImage,
  } = useContext(UserDataContext);

  const navigate = useNavigate();
  const inputImage = useRef(null);

  useEffect(() => {
    if (!userData) {
      navigate("/signup");
    }
    return () => {
      if (frontendImage) URL.revokeObjectURL(frontendImage);
    };
  }, [userData, frontendImage, navigate]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBackendImage(file);
      setFrontendImage(previewUrl);
      setSelectedImage(file);
    }
  };

  const handleCardSelect = async (file) => {
    const previewUrl = URL.createObjectURL(file);
    setBackendImage(file);
    setFrontendImage(previewUrl);
    setSelectedImage(file);
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-[#030353] to-[#808080] flex justify-center items-center flex-col p-[20px] gap-[20px]">
      <MdArrowBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <h1 className="text-white text-[30px] text-center mb-[20px]">
        Select your <span className="text-[blue]">Assistant Image</span>
      </h1>

      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]">
        <Card image={image1} onSelect={handleCardSelect} />
        <Card image={image2} onSelect={handleCardSelect} />
        <Card image={image3} onSelect={handleCardSelect} />
        <Card image={image4} onSelect={handleCardSelect} />

        <div
          className={`w-[150px] h-[250px] bg-[#030326] rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer
            border-2 ${selectedImage ? "border-white shadow-2xl" : "border-blue"}`}
          onClick={() => inputImage.current.click()}
        >
          {!frontendImage && <LuImagePlus className="text-white w-[25px] h-[25px]" />}
          {frontendImage && (
            <img src={frontendImage} className="h-full w-full object-cover" alt="preview" />
          )}
        </div>

        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
      </div>

      {selectedImage && (
        <button
          className="min-w-[100px] h-[50px] bg-[blue] mt-[30px] text-black text-[16px] font-semibold rounded-full cursor-pointer"
          onClick={() => navigate("/customise2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customise;
