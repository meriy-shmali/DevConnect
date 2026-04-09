import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchApi } from '@/api/SearchApi';

export const useSearch = (query, activeTab) => {
  const queryClient = useQueryClient();
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // 1. جلب السجل (Recents) - يتم تحديثه تلقائياً عند الحذف
  const { data: recents = [], isLoading: isRecentsLoading } = useQuery({
    queryKey: ['recentSearches'],
    queryFn: searchApi.getRecents,
  });

  // 2. جلب الاقتراحات أثناء الكتابة (مع منع الطلبات الفارغة)
  const { data: suggestions = [] } = useQuery({
    queryKey: ['suggestions', query, activeTab],
    queryFn: () => searchApi.getSuggestions(query, activeTab),
    enabled: query.length > 0 && !isSearching,
  });

  // 3. ميوتيشن البحث الكامل (عند Enter)
  const searchMutation = useMutation({
    mutationFn: ({ q, type, p }) => searchApi.getResults(q, type, p),
    onSuccess: (data) => {
      if (page === 1) setResults(data.results);
      else setResults(prev => [...prev, ...data.results]);
    }
  });

  // 4. ميوتيشن الحذف (مع تحديث الواجهة فوراً)
  const deleteMutation = useMutation({
    mutationFn: (id) => searchApi.deleteRecent(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['recentSearches']);
    }
  });

  // 5. ميوتيشن الحفظ في السجل
  const saveHistoryMutation = useMutation({
    mutationFn: ({ id, type }) => searchApi.saveToHistory(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries(['recentSearches']);
    }
  });

  const executeSearch = (newPage = 1) => {
    setIsSearching(true);
    setPage(newPage);
    searchMutation.mutate({ q: query, type: activeTab, p: newPage });
  };

  return {
    recents,
    suggestions,
    results,
    isLoading: isRecentsLoading || searchMutation.isLoading,
    isSearching,
    setIsSearching,
    executeSearch,
    deleteRecent: (id) => deleteMutation.mutate(id),
    saveHistory: (id, type) => saveHistoryMutation.mutate({ id, type }),
  };
};