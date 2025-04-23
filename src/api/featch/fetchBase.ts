// utils/fetchBase.ts
async function FetchBase<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL + '/api' + url}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      // Cải thiện xử lý lỗi
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${res.status}`
      );
    }

    return res.json();
  } catch (error) {
    console.error('fetchBase error:', error);
    throw error;
  }
}

export default FetchBase
