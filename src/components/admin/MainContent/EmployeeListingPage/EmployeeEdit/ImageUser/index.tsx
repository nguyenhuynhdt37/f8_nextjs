import React, { useState } from 'react';
import { FiUpload, FiTrash2, FiImage } from 'react-icons/fi';
import { message, Card } from 'antd';

interface IImageUser {
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  preview: string;
  setPreview: React.Dispatch<React.SetStateAction<string>>;
}

const ImageUser = ({ setImage, preview, setPreview }: IImageUser) => {
  const [isDragging, setIsDragging] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      messageApi.error('Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      messageApi.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      messageApi.error('Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      messageApi.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setPreview('');
    setImage(null);
  };

  return (
    <Card className="bg-white shadow-sm rounded-xl">
      {contextHolder}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Ảnh đại diện</h2>

      {preview ? (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              onClick={handleDelete}
              className="absolute -bottom-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
              title="Xóa ảnh"
            >
              <FiTrash2 />
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Bạn có thể thay đổi ảnh đại diện bằng cách kéo thả hoặc chọn ảnh mới
          </p>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <FiImage className="h-8 w-8" />
            </div>
            <p className="text-gray-700 font-medium mb-2">
              Kéo và thả ảnh vào đây
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Hoặc nhấn vào nút bên dưới để chọn ảnh từ thiết bị
            </p>
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <FiUpload className="mr-2" />
              Chọn ảnh
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <p className="mt-4 text-xs text-gray-400">
              Hỗ trợ định dạng: JPG, PNG, GIF (tối đa 5MB)
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ImageUser;
