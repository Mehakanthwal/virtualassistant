import React, { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';

function Card({ image, onSelect }) {
  const { selectedImage } = useContext(UserDataContext);

  const imageUrl = typeof image === "string" ? image : image?.src;

  const handleClick = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "avatar.jpg", { type: blob.type });
      onSelect(file); // just send the file, frontend preview handled in parent
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  };

  const isSelected = selectedImage && (selectedImage === imageUrl || selectedImage.name === "avatar.jpg");

  return (
    <div
      className={`w-[150px] h-[250px] bg-[#030326] rounded-2xl overflow-hidden cursor-pointer
        border-2 ${isSelected ? "border-white shadow-2xl shadow-blue-950" : "border-blue"}
        hover:border-white hover:shadow-2xl hover:shadow-blue-950`}
      onClick={handleClick}
    >
      <img src={imageUrl} alt="Assistant Avatar" className='h-full w-full object-cover' />
    </div>
  );
}

export default Card;
