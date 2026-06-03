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
    if (!query) return recents || []; 
    if (isSearching) {
      return results?.results || (Array.isArray(results) ? results : []);
    }
    return suggestions?.results || (Array.isArray(suggestions) ? suggestions : []);
  };

  const currentList = getActiveList() || [];
  const limit = isExpanded ? currentList.length : 10;
  const visibleItems = currentList.slice(0, limit);
  const itemsCount = currentList.length;

  const handleSearchConfirm = () => {
    if (query.trim() !== '') {
      executeSearch(1);
      setIsSearching(true);
      saveHistory(query, activeTab); 
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchConfirm();
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
    setIsSearching(false); 

    if (value.startsWith('#')) {
      setActiveTab('tags');
    }

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
  
  // 1. استخراج نص البحث أو اسم الشخص لحفظه في السجل قبل الانتقال
  const historyQuery = item.username ||  item.user?.username || item.query || item.title || (typeof item === 'string' ? item : "");
  
  if (historyQuery && typeof historyQuery === 'string') {
    // حفظ العنصر في السجل فور النقر عليه
    saveHistory(historyQuery.trim(), activeTab);
  }
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
    navigate(`/post/${item.id}`, { state: { post: item } });
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
    // تم ضبط الحاوية لتملأ الفراغ المتاح لها بالكامل دون تجاوز
    <div className="relative w-full max-w-full py-1" dir={isRtl ? 'rtl' : 'ltr'} ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          dir={isRtl ? "rtl" : "ltr"}
          placeholder={t('search')}
          className={`w-full py-1.5 ps-10 pe-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 
              focus:ring-blue-500 bg-gray-100 text-gray-900 text-sm md:text-md font-medium placeholder-gray-500 
              dark:text-black dark:bg-gray-50 dark:border-gray-800 dark:placeholder-gray-400 transition-all
               ${isRtl ? 'md:pe-12 ps-4 text-right' : 'md:ps-12 pe-4 text-left'}
                   ${isRtl ? 'text-right' : 'text-left'}`}

          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <IoSearchSharp 
          onClick={handleSearchConfirm}
          className={`absolute top-1/2 transition-colors cursor-pointer transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-black z-10 ${isRtl ? 'end-4' : 'start-4'}`} 
        />
      </div>

      {isOpen && (
        // 💡 تعديل جوهري: الصندوق المنسدل الآن يبدأ من الحافة (left-0 أو right-0) ومطابق تماماً لعرض حقل البحث المتاح بالهيدر ليكون متناسقاً
        <div className="absolute top-full mt-2 bg-white dark:bg-dark-post-background left-1/2 -translate-x-1/2 right-0 w-full min-w-[280px] sm:min-w-[450px] md:min-w-[550px] shadow-2xl rounded-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden transition-all">
          
          {/* Tabs */}
          <div className="flex justify-around py-0.5 border-b border-gray-100 dark:border-gray-800">
            {['people', 'tags', 'posts'].map(tab => (
              <button
                key={tab}
                onClick={() => { 
                  setActiveTab(tab);
                  setIsExpanded(false);
                  setIsSearching(false);
                }}
                className={`flex-1 py-2.5 text-xs md:text-sm font-bold transition-all ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          <div className="py-2 max-h-[60vh] overflow-y-auto comment-scroll">
            
            {/* --- الحالة 1: السجل (عندما يكون الحقل فارغاً) --- */}
            {!query && recents && (
              <div className="animate-fadeIn">
                {recents.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center px-4 md:px-6 mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xs md:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                          {t('recents')}
                        </p>
                        <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {recents.length}
                        </span>
                      </div>
                    </div>
                    {recents.map((item, index) => (
                      <div 
                        key={`recent-${item.id || index}`} 
                        onClick={() => handleItemClick(item)} 
                        className="flex items-center justify-between py-2.5 px-4 md:px-6 hover:bg-gray-50 dark:hover:bg-dark-second-background cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-grow">
                          {activeTab === 'people' ? (
                            <>
                              {/* 💡 جعل الصورة دائرية ومتساوية تماماً لمنع التمدد */}
                              <img 
                                src={item.user?.personal_photo_url || item.user?.image || '/default-avatar.png'} 
                                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover flex-shrink-0 border border-gray-100" 
                                alt=""
                              />
                              <div className="flex flex-col space-y-1  min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-sm md:text-base font-semibold dark:text-white truncate">
                                    {item.user?.username || item.query || item.username}
                                  </span>
                                  {(item.user?.is_following || item.is_following) && (
                                    <span className="text-[11px] text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded font-bold flex-shrink-0">
                                      {t('following')}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500 truncate">{item.user?.specialization}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <MdHistory className="text-gray-400 w-5 h-5 flex-shrink-0" />
                              <span className="text-sm font-medium dark:text-white truncate">
                                {/* 💡 تم تصحيح الشرط لـ tagss */}
                                {activeTab === 'tags' ? `#${item.query || item.name || item}` : (item.query|| item.title || item)}
                              </span>
                            </>
                          )}
                        </div>

                        <button 
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            deleteRecent(item.id); 
                          }}
                        >
                          <IoClose className="text-gray-400 hover:text-red-500 w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-6 py-4 text-gray-400 text-xs italic text-center">
                    {t('no_recent_searches')}
                  </div>
                )}
              </div>
            )}

            {/* --- الحالة 2: الاقتراحات والنتائج (عند وجود نص) --- */}
            {query && (
              <div className="animate-fadeIn">
                {isSearching && (
                  <div className="px-4 md:px-6 mb-2 flex items-center gap-2">
                    <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">
                      {t('results')}
                    </p>
                    <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {itemsCount}
                    </span>
                  </div>
                )}
                {visibleItems.map((item, index) => (
                  <div 
                    key={`res-${item.id || index}`} 
                    onClick={() => handleItemClick(item)} 
                    // 💡 تم تصحيح الشرط هنا أيضاً لـ tagss
                    className={`px-4 md:px-6 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-second-background cursor-pointer transition-colors
                      ${isSearching && (activeTab === 'posts' || activeTab === 'tags') ? 'mb-1' : 'flex items-center gap-3'}`}
                  >
                    {isSearching && (activeTab === 'posts' || activeTab === 'tags') ? (
                      <PostSearchResult item={item} />
                    ) : (
                      <>
                        {activeTab === 'people' ? (
                          <>
                            <img 
                              src={item.personal_photo_url || '/default-avatar.png'} 
                              className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover flex-shrink-0" 
                              alt="" 
                            />
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm md:text-base font-semibold dark:text-white truncate">{item.username}</span>
                                {(item.user?.is_following || item.is_following) && (
                                  <span className="text-[11px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold flex-shrink-0">
                                    {t('followingg')}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 truncate">{item.specialization}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <IoSearchSharp className="text-gray-400 flex-shrink-0 w-4 h-4" />
                            <span className="text-sm font-medium dark:text-white truncate">
                              {activeTab === 'tags' 
                                ? ` #${item.name || item.query || item} `
                                : (item.query || item.username || item.title || item)}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {!isExpanded && currentList.length > 10 && (
                  <button className="w-full py-2.5 text-sm text-blue-600 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsExpanded(true)}>
                    {t('show_more')}
                  </button>
                )}
                
                {isSearching && itemsCount === 0 && (
                  <div className="py-8 text-center text-gray-400 text-xs italic">{t('no_results')}</div>
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