// src/lib/cloudinary.js
const CLOUD_NAME = import.meta.env._CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env._CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'avatars/');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Upload gagal');
  return data;
};