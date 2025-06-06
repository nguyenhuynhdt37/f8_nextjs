'use client';

import React, { useState } from 'react';
import uploadImage, { generateUniqueFileName } from '@/Utils/functions/uploadImage';
import { message } from 'antd';

const ImageUploadTest = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // Generate a unique filename
            const renamedFile = generateUniqueFileName(file);

            // Upload the image
            const url = await uploadImage(renamedFile);

            // Set the image URL
            setImageUrl(url);
            message.success('Tải ảnh lên thành công!');
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Không thể tải ảnh lên. Vui lòng thử lại sau.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Kiểm tra tải ảnh bài viết
                    </h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Chọn ảnh để tải lên
                            </label>

                            <div className="flex items-center space-x-4">
                                <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
                                    Chọn ảnh
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg, image/png, image/gif, image/jpg"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                </label>
                                {isUploading && (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600 mr-2"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Đang tải lên...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {imageUrl && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Ảnh đã tải lên
                                </h2>

                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt="Uploaded image"
                                        className="w-full h-auto max-h-96 object-contain"
                                    />
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL của ảnh:</p>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={imageUrl}
                                            readOnly
                                            className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(imageUrl);
                                                message.success('Đã sao chép URL ảnh');
                                            }}
                                            className="ml-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm transition-colors"
                                        >
                                            Sao chép
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadTest; 