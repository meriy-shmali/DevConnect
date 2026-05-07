import api from "./Api";

export const searchApi = {
  // جلب الاقتراحات أثناء الكتابة
  getSuggestions: async (query, type) => {
    const response = await api.get("/search/suggestions/", {
      params: { q: query, type: type },
    });
    return response.data;
  },

  // جلب النتائج الكاملة عند الضغط على Enter
 // جلب النتائج الكاملة (تغيير الرابط من /results/ إلى /search/)
  getResults: async (query, type, page = 1) => {
    const response = await api.get("/search/", { 
      params: { q: query, type: type, page: page },
    });
    return response.data; 
  },

 

  // جلب سجل البحث (Recents)
  getRecents: async (type) => {
    const response = await api.get("/search/history/", {
      params: { type: type }
    });
    return response.data;
  },

  // حذف عنصر من السجل
  deleteRecent: async (id) => {
    const response = await api.delete(`/search/history/${id}/`);
    return response.data;
  },

  // حفظ في السجل (عند زيارة بروفايل أو الضغط على نتيجة)
  saveToHistory: async (itemId) => {
    const response = await api.post("/search/people/click/", {
    username: itemId, 
    });
    return response.data;
  }
};