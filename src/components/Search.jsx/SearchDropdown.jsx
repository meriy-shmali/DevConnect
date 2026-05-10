import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@/hook/UseSearchMutation';
import PostSearchResult from './PostSearchResult'; 
import { IoClose, IoSearchSharp } from 'react-icons/io5'; 
import { MdHistory } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const SearchDropdown = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';
  
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('people');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

 const { 
    results, recents, suggestions, 
    executeSearch, deleteRecent, saveHistory, 
    isSearching, setIsSearching 
  } = useSearch(query, activeTab);

   const getActiveList = () => {
    // 1. إذا لم يكن هناك نص، أعد السجل (غالباً مصفوفة مباشرة)
    if (!query) return recents || []; 

    // 2. إذا ضغط المستخدم Enter (البحث الكامل)
    if (isSearching) {
      // نتحقق إذا كانت النتائج داخل مفتاح results أو هي المصفوفة نفسها
      return results?.results || (Array.isArray(results) ? results : []);
    }

    // 3. حالة الاقتراحات (أثناء الكتابة)
    // نتحقق من وجود مفتاح results داخل suggestions
    return suggestions?.results || (Array.isArray(suggestions) ? suggestions : []);
  };

  const currentList = getActiveList() || [];
  const limit = isExpanded ? currentList.length : 10;
  const visibleItems = currentList.slice(0, limit);
  const itemsCount = currentList.length;

  const handleSearchConfirm = () => {
    if (query.trim() !== '') {
      executeSearch(true);
      setIsSearching(true);
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    // 1. منع أي سلوك افتراضي للمتصفح (مهم جداً)
    e.preventDefault();

    if (query.trim() !== '') {
      console.log("Enter key pressed for query:", query); // سطر للتأكد في Console
      
      // 2. تنفيذ البحث
      executeSearch(1);
      setIsSearching(true);

      // 3. استدعاء دالة الحفظ 
      // تأكدي أن saveHistory قادمة من useSearch
      saveHistory(query, activeTab); 

      setIsExpanded(false);
    }
  }
};
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
        setIsSearching(false);
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSearching]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsSearching(false); // يعيد السجل أو الاقتراحات للظهور فور الكتابة

    if (value.startsWith('#')) {
      setActiveTab('tags');
    }
    setQuery(value);
  setIsSearching(false);

  if (value === '') {
    setIsExpanded(false);
  }
  if (value.length >= 0) setIsOpen(true);
};

  const handleItemClick = (item) => {
 const userId = item.user?.id || item.id;
  
  // للتاغات: نأخذ الاسم أو الكلمة المبحوث عنها
  const tagName = item.name || item.query || (typeof item === 'string' ? item : "");
  
  // للمنشورات: نأخذ أيدي المنشور
  const postId = item.id;

  // 2. التنفيذ بناءً على التبويب النشط
  if (activeTab === 'people') {
    if (userId) {
      console.log("Navigating to user profile:", userId);
      navigate(`/profile/${userId}`);
      setIsOpen(false);
    } else {
      // حالة احتياطية إذا لم يتوفر ID (مثلاً نص بحث عام)
      const searchQuery = item.username || item.query || item;
      setQuery(searchQuery);
      setIsSearching(true);
      executeSearch(1);
    }
  }
  // 2. إذا ضغطنا على منشور (سواء في تبويبة posts أو tags)
  else if (isSearching && (activeTab === 'posts' || activeTab === 'tags')) {
    // ننتقل لصفحة المنشور ونمرر البيانات
    navigate(`/posts/${item.id}`, { state: { post: item } });
    setIsOpen(false);
  } 
  // 3. إذا كان مجرد اقتراح نصي (قبل البحث الكامل)
  else {
    const identifier = item.title || item.query || item;
    setQuery(identifier); 
    setIsSearching(true);
    executeSearch(1); // تنفيذ البحث فوراً عند الضغط على اقتراح
  }
};
 
  return (
    <div className="relative w-full md:max-w-2xl mx-auto py-2" dir={isRtl ? 'rtl' : 'ltr'} ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          dir='auto'
          placeholder={t('Search')}
          className={`w-full py-2.5 ps-12 pe-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 
              focus:ring-blue-500 bg-gray-100 text-gray-900 md:text-lg font-semibold placeholder-gray-700 
              dark:text-dark-text dark:bg-gray-50 dark:border-gray-800 dark:placeholder-gray-400 
               ${isRtl ? 'md:pr-16 pl-6 text-right' : 'md:pl-16 pr-6 text-left'}`}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <IoSearchSharp className={`absolute top-1/2 transition-colors transform -translate-y-1/2 h-6 w-6 md:w-7 md:h-7 text-gray-700 dark:text-dark-text z-10 ${isRtl ? 'right-4' : 'left-4'}`} />
      </div>
    {isOpen && (
        <div className="absolute top-full mt-1 bg-white dark:bg-dark-post-background left-1/2 -translate-x-1/2 w-[90vw] md:w-[600px] shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          {/* Tabs */}
          <div className="flex justify-around py-1 border-b dark:border-gray-700">
            {['people', 'tags', 'posts'].map(tab => (
              <button
                key={tab}
                onClick={() => { 
                  setActiveTab(tab);
                  setIsExpanded(false);
                  setIsSearching(false);
                }}
                className={`flex-1 py-3 md:py-2 md:text-base text-sm font-bold ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          <div className={`py-4 max-h-[70vh] overflow-y-auto custom-scrollbar`}>
            
            {/* --- الحالة 1: السجل (عندما يكون الحقل فارغاً) --- */}
            {!query && recents && recents.length > 0 && (
             <div className="animate-fadeIn">
               {recents && recents.length > 0 ? (
      <>
              <div className="flex justify-between items-center px-8 mb-3">
               <div className="flex items-center gap-2">
                <p className="text-base md:text-lg font-bold text-gray-500 dark:text-gray-400">
                  {t('recents')}
                </p>
            {/* إضافة دائرة العدد بجانب السجل */}
                <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs font-bold">
                {recents.length}
                </span>
               </div>
            </div>
          {recents.map((item, index) => (
  <div 
    key={`recent-${item.id || index}`} 
    onClick={() => handleItemClick(item)} 
    className="flex items-center justify-between py-3 px-8 hover:bg-gray-100 dark:hover:bg-dark-second-background cursor-pointer"
  >
    <div className="flex items-center gap-4">
      {/* 1. حالة الأشخاص: نعرض الصورة والاسم من داخل كائن user */}
      {activeTab === 'people' ? (
        <>
          <img 
            src={item.user?.personal_photo_url || item.user?.image || '/default-avatar.png'} 
            className="w-9 h-9 rounded-full object-cover" 
            alt="avatar" 
          />
          <span className="text-sm font-bold dark:text-white">
            {item.user?.username || item.query || item.username}
          </span>
        </>
      ) : (
        /* 2. حالة التاغات والمنشورات: أيقونة الساعة + النص فقط (بدون صورة) */
        <>
          <MdHistory className="text-gray-400 w-6 h-6" />
          <span className="text-sm font-bold dark:text-white">
            {activeTab === 'tags' ? `#${item.query || item.name || item}` : (item.query|| item.title || item)}
          </span>
        </>
      )}
    </div>

    {/* زر الحذف من السجل */}
    <button 
      onClick={(e) => { 
        e.stopPropagation(); 
        deleteRecent(item.id); 
      }}
    >
      <IoClose className="text-gray-400 hover:text-red-500" />
    </button>
  </div>
))}
  
      </>
    ) : (
      /* إذا كان السجل فارغاً تماماً في الباك إند */
      <div className="px-8 py-4 text-gray-400 text-sm italic">
        {t('no_recent_searches')}
      </div>
    )}
  </div>
)}

            {/* --- الحالة 2: الاقتراحات والنتائج (عند وجود نص) --- */}
           {query && (
           <div className="animate-fadeIn">
            {/* تظهر كلمة Results والعدد فقط عند الضغط على Enter (isSearching) */}
             {isSearching && (
             <div className="px-8 mb-4 flex items-center gap-2">
               <p className="text-base md:text-lg font-bold text-gray-800 dark:text-white">
                {t('results')}
               </p>
                 <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-0.5 rounded-full text-sm font-bold">
                  {itemsCount}
                 </span>
              </div>
               )}
                {visibleItems.map((item, index) => (
  <div 
    key={`res-${item.id || index}`} 
    onClick={() => handleItemClick(item)} 
    className={`px-8 py-3 hover:bg-gray-50 dark:hover:bg-dark-second-background cursor-pointer 
      ${isSearching && (activeTab === 'posts' || activeTab === 'tags') ? 'mb-2' : 'flex items-center gap-4'}`}
  >
    {/* تعديل المنطق: إذا كنا نبحث وظهرت نتائج بوستات أو تاغات (لأن كلاهما يعيد منشورات) */}
    {isSearching && (activeTab === 'posts' || activeTab === 'tags') ? (
      <PostSearchResult item={item} />
    ) : (
      <>
        {activeTab === 'people' ? (
          <>
            <img src={item.personal_photo_url || '/default-avatar.png'} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div className="flex flex-col">
              <span className="text-sm font-bold dark:text-white">{item.username}</span>
              <span className="text-xs text-gray-500">{item.specialization}</span>
            </div>
          </>
        ) : (
          /* حالة الاقتراحات قبل الضغط على Enter أو تبويبة التاغات */
          <>
            <IoSearchSharp className="text-gray-400" />
            <span className="text-sm font-bold dark:text-white">
              {activeTab === 'tags' 
                ?` #${item.name || item.query || item} `
                : (item.query ||item.username || item.title || item)}
            </span>
          </>
        )}
      </>
    )}
  </div>
))}
                {/* زر عرض المزيد */}
                {!isExpanded && currentList.length > 10 && (
                  <button className="w-full py-3 text-blue-600 font-bold hover:underline" onClick={() => setIsExpanded(true)}>
                    {t('show_more')}
                  </button>
                )}
                
                {isSearching && itemsCount === 0 && (
                  <div className="py-10 text-center text-gray-500 italic">{t('no_results')}</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;