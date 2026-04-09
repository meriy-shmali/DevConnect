import React, { useRef } from 'react';
import { useTranslation } from "react-i18next";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearch } from '@/hook/UseSearch';
import { useOnClickOutside } from '@/hook/useOnClickOutside';

const SearchBar = () => {
  const { t } = useTranslation();
  const searchRef = useRef();
  
  // استدعاء المنطق الذي صممناه سابقاً
  const { 
    searchTerm, 
    setSearchTerm, 
    activeTab, 
    setActiveTab, 
    suggestions, 
    isDropdownOpen, 
    setIsDropdownOpen,
    handleKeyDown, 
    handleProfileClick 
  } = useSearch();

  // إغلاق القائمة عند النقر خارجها
  useOnClickOutside(searchRef, () => setIsDropdownOpen(false));

  return (
    <div className="relative" ref={searchRef}>
      {/* حقل البحث الرئيسي كما في تصميمك */}
      <div className="flex items-center bg-gray-100 dark:bg-dark-post-background rounded-full px-4 py-1.5 w-64 lg:w-80 transition-all focus-within:ring-2 focus-within:ring-follow-button">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={t('search')}
          className="bg-transparent border-none outline-none text-sm w-full dark:text-dark-text"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>

      {/* القائمة المنسدلة الديناميكية */}
      {isDropdownOpen && (searchTerm.length > 0 || suggestions.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-dark-post-background shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
          
          {/* التابات (Tabs) للتبديل بين أنواع البحث */}
          <div className="flex border-b dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
            {['people', 'tags', 'posts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab 
                  ? 'text-follow-button border-b-2 border-follow-button bg-white dark:bg-dark-post-background' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* عرض الاقتراحات والنتائج */}
          <div className="max-h-72 overflow-y-auto custom-scrollbar">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => activeTab === 'people' ? handleProfileClick(item.id) : setIsDropdownOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  {activeTab === 'people' ? (
                    <>
                      <img src={item.avatar} className="w-9 h-9 rounded-full object-cover border border-gray-100" alt="" />
                      <div className="flex flex-col text-right" dir="rtl">
                        <span className="text-sm font-bold dark:text-dark-text">{item.name}</span>
                        <span className="text-[10px] text-gray-500">{item.specialization || item.username}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-right w-full px-2" dir="rtl">
                      <span className="text-follow-button font-bold">#</span><span className="text-sm dark:text-dark-text font-medium">{item.name || item.text}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">
                {t('no_results_found')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;