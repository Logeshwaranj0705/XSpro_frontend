import React,{useRef, useState} from 'react';
import {LuUser, LuUpload, LuTrash} from "react-icons/lu";

const ProfilePhotoSelector = ({image, setImage}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) =>{
    const file = event.target.files[0];
    if(file){
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () =>{
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex justify-center mb-6">
      <input 
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-400 rounded-full relative">
          <LuUser className="text-4xl text-primary" />

          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="absolute bottom-1 right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute bottom-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector;
