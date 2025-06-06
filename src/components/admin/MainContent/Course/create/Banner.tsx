import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiImage, FiTrash2 } from 'react-icons/fi';
import { message } from 'antd';

const Banner = ({ data, setData }: any) => {
  const [messageApi, contextHolder] = message.useMessage();

  // Debug log when data changes
  useEffect(() => {
    console.log('Banner component - data type:', typeof data);
    console.log('Banner component - data instanceof File:', data instanceof File);
    if (data) {
      if (typeof data === 'string') {
        console.log('Banner component - data is URL string:', data.substring(0, 50) + '...');
      } else if (data instanceof File) {
        console.log('Banner component - data is File:', {
          name: data.name,
          size: data.size,
          type: data.type
        });
      } else if (data && data.banner) {
        console.log('Banner component - data.banner exists:', typeof data.banner);
      }
    }
  }, [data]);

  // Get the image source safely, handling both File objects and URL strings
  const imageSource = useMemo(() => {
    try {
      if (!data) return null;

      // If data is a string (URL), return it directly
      if (typeof data === 'string') return data;

      // If data is a File object with name and type properties
      if (data instanceof File || (data && data.name && data.type)) {
        try {
          return URL.createObjectURL(data);
        } catch (error) {
          console.error('Error creating object URL:', error);
          return null;
        }
      }

      // For backwards compatibility, if data.banner exists
      if (data.banner) {
        if (typeof data.banner === 'string') return data.banner;
        if (data.banner instanceof File) {
          try {
            return URL.createObjectURL(data.banner);
          } catch (error) {
            console.error('Error creating object URL for data.banner:', error);
            return null;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Unexpected error in imageSource calculation:', error);
      return null;
    }
  }, [data]);

  const onDrop = useCallback((acceptedFiles: any) => {
    try {
      // Validate we have files
      if (!acceptedFiles || acceptedFiles.length === 0) {
        console.log('No files received in drop');
        return;
      }

      // Validate file type
      const file = acceptedFiles[0];
      console.log('Dropped file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        messageApi.error('Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF, WEBP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        messageApi.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Generate a unique filename to avoid conflicts
      const timestamp = new Date().getTime();
      const uniqueFileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      const renamedFile = new File([file], uniqueFileName, { type: file.type });
      console.log('Created file with unique name:', uniqueFileName);

      setData((prev: any) => {
        const result = {
          ...prev,
          banner: renamedFile,
        };
        console.log('Updated data with new banner');
        return result;
      });
    } catch (error) {
      console.error('Error in onDrop handler:', error);
      messageApi.error('Có lỗi xảy ra khi xử lý file. Vui lòng thử lại.');
    }
  }, [messageApi, setData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': []
    }
  });

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Deleting banner image');
    setData((prev: any) => {
      return {
        ...prev,
        banner: null,
      };
    });
  };

  return (
    <>
      {contextHolder}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg transition-colors ${isDragActive
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 hover:border-indigo-400'
          }`}
      >
        <input {...getInputProps()} />

        {imageSource ? (
          <div className="p-4">
            <div className="relative max-w-2xl mx-auto">
              <img
                src={imageSource}
                alt="Ảnh bìa"
                className="w-full h-auto rounded-lg shadow-sm object-cover"
                onError={() => console.error('Error loading image from source:', imageSource)}
              />
              <button
                onClick={handleDeleteImage}
                className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                title="Xóa ảnh"
              >
                <FiTrash2 />
              </button>
            </div>

            <div className="text-center mt-4 text-gray-500 text-sm">
              Nhấp hoặc kéo thả để thay đổi ảnh
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <FiImage className="h-8 w-8" />
            </div>
            <p className="text-gray-700 font-medium mb-2">
              Kéo và thả ảnh vào đây
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Hoặc nhấn vào nút bên dưới để chọn ảnh từ thiết bị
            </p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiUpload className="mr-2" />
              Chọn ảnh
            </button>
            <p className="mt-4 text-xs text-gray-400">
              Hỗ trợ định dạng: JPG, PNG, GIF, WEBP (tối đa 5MB)
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(Banner);
