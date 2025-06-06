import { message } from 'antd';

/**
 * Uploads an image to the server
 * @param file The file to upload
 * @param type The type of upload ('post-image' or 'avatar')
 * @returns Promise with the URL of the uploaded image
 */
export const uploadImage = async (file: File, type: 'post-image' | 'avatar' = 'post-image'): Promise<string> => {
    const messageKey = 'uploadImage';
    message.loading({ content: 'Đang tải ảnh lên...', key: messageKey });

    try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Loại tệp không được hỗ trợ. Vui lòng chọn ảnh dạng JPEG, PNG hoặc GIF.');
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB.');
        }

        // Create form data
        const formData = new FormData();
        formData.append('File', file);

        // For avatar uploads, we need to include the 'avatar' field as well
        if (type === 'avatar') {
            formData.append('avatar', file);
        }

        // Get base URL from environment
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Make the request
        const response = await fetch(`${baseUrl}/api/upload/${type}`, {
            method: 'POST',
            body: formData,
            credentials: 'include', // Important for cookies/auth
        });

        if (!response.ok) {
            console.error('Upload failed with status:', response.status);
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Upload response:', result);

        if (result?.statusCode === 200 || result?.statusCode === 201) {
            // Get URL from the response based on upload type
            let imageUrl: string | null = null;

            if (type === 'avatar' && result.data?.avatarUrl) {
                imageUrl = result.data.avatarUrl;
            } else if (result.data?.url) {
                imageUrl = result.data.url;
            } else if (typeof result.data === 'string' && result.data.includes('http')) {
                imageUrl = result.data;
            } else if (typeof result.data === 'string') {
                // If it's a relative path, construct the full URL
                imageUrl = `${baseUrl}${result.data.startsWith('/') ? '' : '/'}${result.data}`;
            }

            if (imageUrl) {
                message.success({ content: 'Tải ảnh thành công', key: messageKey, duration: 2 });
                return imageUrl;
            } else {
                throw new Error('Không tìm thấy URL ảnh trong phản hồi');
            }
        } else {
            throw new Error(result?.message || 'Tải ảnh không thành công');
        }
    } catch (error: any) {
        console.error('Image upload error:', error);
        message.error({
            content: `Lỗi khi tải ảnh: ${error.message || 'Không xác định'}`,
            key: messageKey,
            duration: 3
        });
        throw error;
    }
};

/**
 * Generates a unique filename for an image
 * @param file Original file
 * @returns A new File object with a unique name
 */
export const generateUniqueFileName = (file: File): File => {
    const timestamp = new Date().getTime();
    const uuid = Math.random().toString(36).substring(2, 10);
    const fileExtension = file.name.split('.').pop() || '';
    const newFileName = `${timestamp}_${uuid}.${fileExtension}`;

    return new File([file], newFileName, { type: file.type });
};

export default uploadImage; 