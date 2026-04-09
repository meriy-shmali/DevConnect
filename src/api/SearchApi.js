import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // تأكدي من مطابقة المنفذ (Port) للباك إند
});

export const searchApi = {
  // جلب الاقتراحات أثناء الكتابة
  getSuggestions: async (query, type) => {
    const response = await api.get("/search/suggestions/", {
      params: { q: query, type: type },
    });
    return response.data;
  },

  // جلب النتائج الكاملة عند الضغط على Enter
  getResults: async (query, type, page = 1) => {
    const response = await api.get("/search/results/", {
      params: { q: query, type: type, page: page },
    });
    return response.data; // المتوقع: { results: [], next: Boolean/URL }
  },

  // جلب سجل البحث (Recents)
  getRecents: async () => {
    const response = await api.get("/search/recent/");
    return response.data;
  },

  // حذف عنصر من السجل
  deleteRecent: async (itemId) => {
    const response = await api.delete(`/search/recent/${itemId}/`);
    return response.data;
  },

  // حفظ في السجل (عند زيارة بروفايل أو الضغط على نتيجة)
  saveToHistory: async (itemId, type) => {
    const response = await api.post("/search/history/", {
      item_id: itemId,
      type: type,
    });
    return response.data;
  }
};