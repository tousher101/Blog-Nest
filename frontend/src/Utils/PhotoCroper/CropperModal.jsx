import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage';

export default function CropperModal(props) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCropAndUpload = async () => {
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      props.onUpload(blob)
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-[90vw] max-w-md space-y-4">
        <h1 className="text-lg font-semibold text-center">Upload Your Photo</h1>
        <p className='text-center'>Photo Size Max: 2MB / jpeg, png, jpg format allowed</p>

        {!imageSrc ? (
          <div className="text-center">
            <button onClick={props.cancel} className='fixed lg:bottom-0 lg:translate-y-[-50] md:top-0 md:left-[30px] top-0 left-[30px]  mt-[30px] border border-white h-[60px] w-[60px]
            rounded-4xl text-2xl text-center hover:opacity-50 hover:bg-[#374151] cursor-pointer text-white'>X</button>
            <input
              type="file"
              accept="image/*"
              id="fileUpload"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="fileUpload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              Choose Photo
            </label>
          </div>
        ) : (
          <div className="relative w-full h-64 bg-gray-200">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {imageSrc && (
          <div className="flex justify-between">
            <button
              onClick={props.cancel}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={()=>{handleCropAndUpload();props.cancel()}}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
