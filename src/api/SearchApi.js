import api from "./Api";

export const searchApi = {
  // جلب الاقتراحات أثناء الكتابة
  getSuggestions: async (query, type) => {
    const cleanQuery = query.startsWith('#') ? query.substring(1) : query;
    const response = await api.get("/search/suggestions/", {
      params: { q: cleanQuery, type: type },
    });
    return response.data;
  },

  // جلب النتائج الكاملة عند الضغط على Enter
 // جلب النتائج الكاملة (تغيير الرابط من /results/ إلى /search/)
  getResults: async (query, type, page = 1) => {
    const cleanQuery = query.startsWith('#') ? query.substring(1) : query;
    const response = await api.get("/search/", { 
      params: { q: cleanQuery, type: type, page: page },
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
saveToHistory: async ({ query, type }) => {
  let url = '';
  let payload = {};

  if (type === 'people') {
    // للأشخاص: الرابط الصحيح هو /click/ وليس /save/
    url = '/search/people/click/';
    payload = { username: query }; // الباك إند يتوقع username للأشخاص
  } else {
    // للتاغات أو المنشورات: بما أن /search/save/ يعطي 404
    // جربي الرابط الموحد للسجل إذا كان الباك إند يدعم POST عليه
    url = '/search/history/'; 
    payload = { query, type };
  }

  const response = await api.post(url, payload);
  return response.data;
},
}