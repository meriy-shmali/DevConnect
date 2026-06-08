import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchApi } from '@/api/SearchApi';

export const useSearch = (query, activeTab) => {
  const queryClient = useQueryClient();
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // 1. جلب السجل (Recents)
  const { data: recentsData } = useQuery({
  queryKey: ['recentSearches', activeTab],
  queryFn: () => searchApi.getRecents(activeTab),
  staleTime: 30000, // 30 ثانية كافية لمنع التكرار المزعج
  refetchOnWindowFocus: false, // يمنع الطلب عند العودة لتبويب المتصفح
});
  
  // تصحيح: استخدام || بدلاً من الفراغ
  const recents = recentsData?.results || [];

  // 2. جلب الاقتراحات أثناء الكتابة
  const { data: suggestionsData } = useQuery({
    queryKey: ['suggestions', query, activeTab],
    queryFn: () => searchApi.getSuggestions(query, activeTab),
    enabled: query.length > 0 && !isSearching,staleTime: 10000
  });
  
  const suggestions = suggestionsData?.results || [];

  // 3. ميوتيشن البحث الكامل (عند Enter)
  const searchMutation = useMutation({
    mutationFn: ({ q, type, p }) => searchApi.getResults(q, type, p),
    onSuccess: (data) => {
      const newResults = data?.results || []; 
      if (page === 1) setResults(newResults);
      else setResults(prev => [...prev, ...newResults]);
    }
  });

  // 4. ميوتيشن الحذف
  const deleteMutation = useMutation({
    mutationFn: (id) => searchApi.deleteRecent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSearches'] });
    }
  });

  // 5. ميوتيشن الحفظ (تم تصحيح طريقة التعريف لمنع خطأ Hook Call)
 const saveHistoryMutation = useMutation({
  mutationFn: (variables) => searchApi.saveToHistory(variables),
  onSuccess: () => {
    // تحديث السجل الخاص بالتبويب الحالي فقط
    queryClient.invalidateQueries({ 
        queryKey: ['recentSearches', activeTab] 
    });
}})

  const executeSearch = (newPage = 1) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setPage(newPage);
    searchMutation.mutate({ q: query, type: activeTab, p: newPage });
  };

  return {
    recents,
    suggestions,
    results,
    isSearching,
    setIsSearching,
    executeSearch,
    deleteRecent: (id) => deleteMutation.mutate(id),
    // تصحيح: تمرير القيم ككائن ليتوافق مع variables في mutationFn
    saveHistory: (item, type) => {
  // 1. استخراج القيمة النصية الصحيحة (String)
  // الباك إند يحتاج القيمة كنص وليس ككائن
  const valueToSave = type === 'people' 
    ? (item.username || (typeof item === 'string' ? item : '')) 
    : (item.query || item.name || (typeof item === 'string' ? item : ''));

  if (!valueToSave) return; // منع إرسال قيم فارغة
  const cleanValue = valueToSave.toString().replace(/^#+/, '');

  console.log("Sending to backend without hash:", cleanValue);

  // 3. إرسال البيانات النظيفة
  saveHistoryMutation.mutate({ 
    query: cleanValue, 
    type: type 
  });
},
  isLoading: searchMutation.isPending
};
  };
