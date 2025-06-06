/**
 * Hàm chuyển đổi chuỗi tiếng Việt có dấu thành không dấu
 * @param str Chuỗi cần chuyển đổi
 * @returns Chuỗi đã được chuyển đổi thành không dấu
 */
export function removeVietnameseTones(str: string): string {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");

    // Loại bỏ các ký tự đặc biệt
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");

    return str;
}

/**
 * Tạo slug từ chuỗi và ID
 * @param title Tiêu đề cần chuyển đổi thành slug
 * @param id ID để thêm vào cuối slug
 * @returns Chuỗi slug đã được tạo
 */
export function generateSlug(title: string, id: number): string {
    // Chuyển đổi tiếng Việt có dấu thành không dấu
    const normalizedTitle = removeVietnameseTones(title);

    // Chuyển thành chữ thường, thay thế khoảng trắng bằng dấu gạch ngang
    const slug = normalizedTitle
        .toLowerCase()
        .replace(/\s+/g, '-')     // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-')      // Thay thế nhiều dấu gạch ngang bằng một dấu gạch ngang
        .trim();                  // Cắt khoảng trắng đầu/cuối

    // Thêm ID vào slug
    return `${slug}-${id}`;
}

/**
 * Tạo slug từ chuỗi (không có ID)
 * @param title Tiêu đề cần chuyển đổi thành slug
 * @returns Chuỗi slug đã được tạo
 */
export function generateSlugWithoutId(title: string): string {
    // Chuyển đổi tiếng Việt có dấu thành không dấu
    const normalizedTitle = removeVietnameseTones(title);

    // Chuyển thành chữ thường, thay thế khoảng trắng bằng dấu gạch ngang
    return normalizedTitle
        .toLowerCase()
        .replace(/\s+/g, '-')     // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-')      // Thay thế nhiều dấu gạch ngang bằng một dấu gạch ngang
        .trim();                  // Cắt khoảng trắng đầu/cuối
}

/**
 * Trích xuất ID từ slug
 * @param slug Chuỗi slug cần trích xuất ID
 * @returns ID được trích xuất từ slug hoặc null nếu không tìm thấy
 */
export function extractIdFromSlug(slug: string): number | null {
    // Tìm ID ở cuối slug (định dạng: ten-khoa-hoc-123)
    const matches = slug.match(/-(\d+)$/);
    if (matches && matches[1]) {
        return parseInt(matches[1], 10);
    }
    return null;
} 