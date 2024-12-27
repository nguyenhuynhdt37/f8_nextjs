import { message } from 'antd';
import { ChangeEvent, useRef, useState } from 'react';

const ImageUser = ({ setImage, preview, setPreview }: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      const newPreview = URL.createObjectURL(file);
      cropImage(newPreview, file);
    } else {
      messageApi.open({
        content: 'Vui lòng chọn file ảnh hợp lệ!',
        type: 'warning',
      });
    }
  };

  const handleDelete = () => {
    setPreview('');
    setImage(null);
  };

  const cropImage = (imageSrc: string, file: File) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      image.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const size = Math.min(image.width, image.height);
          canvas.width = 200;
          canvas.height = 200;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            image,
            (image.width - size) / 2,
            (image.height - size) / 2,
            size,
            size,
            0,
            0,
            200,
            200,
          );
          canvas.toBlob(blob => {
            if (blob) {
              const croppedFile = new File([blob], file.name, {
                type: 'image/jpeg',
              });
              setImage(croppedFile);
              setPreview(URL.createObjectURL(blob));
            }
          }, 'image/jpeg');
        }
      };
    }
  };

  return (
    <div className="rounded-xl border-2 border-[#e5bda7] bg-[#fff] px-5 py-10">
      {contextHolder}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="flex items-center">
        <div className="mr-10">
          {preview && (
            <img
              className="w-20 rounded-xl object-cover"
              src={preview}
              alt="Chưa có ảnh"
            />
          )}
          {!preview && (
            <div className="h-20 w-20 rounded-xl bg-[#cdcdcd]"></div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <label
            htmlFor="file-upload"
            className="mr-4 cursor-pointer rounded-lg bg-[#3590f1] px-4 py-3 text-[#fff]"
          >
            Chọn tệp
          </label>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <button
          className="rounded-lg bg-[#f9fafc] px-6 py-3 ps-10 pt-2 text-[#f92828]"
          onClick={handleDelete}
        >
          Xoá ảnh
        </button>
      </div>
    </div>
  );
};

export default ImageUser;
