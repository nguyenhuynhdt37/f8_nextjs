import FetchBase from "./fetchBase";

// Lấy danh sách learning paths
export const getLearningPathById = async (id: string | number, cookieHeader: any) => {

    try {
        return await FetchBase(`/study-schedule/get_by_learning_path_id/${id}`, { method: 'get', headers: { 'Content-Type': 'application/json', Cookie: cookieHeader } })
    } catch (e) {
        throw e;
    }
}


