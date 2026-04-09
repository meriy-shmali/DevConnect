import React, { useState,useRef,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@/hook/UseSearchMutation';
import PostSearchResult from './PostSearchResult'; // تأكدي من المسار الصحيح
import { IoClose,IoSearchSharp } from 'react-icons/io5'; // استيراد أيقونات
import { MdHistory } from 'react-icons/md';

const SearchDropdown = () => {
  const {t,i18n}=useTranslation();
  const isRtl=i18n.language==='ar';
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('people');
 const { 
  results, recents, suggestions, 
  executeSearch, deleteRecent, saveHistory, 
  isSearching, setIsSearching 
} = useSearch(query, activeTab);
  const [isExpanded,setIsExpanded]=useState(false);
  const [isOpen,setIsOpen]=useState(false);
 // const [isSearching,setIsSearching]=useState(false);
  const dropdownRef=useRef(null);
  // 1. تعديل منطق اختيار القائمة ليكون أكثر دقة
const getActiveList = () => {
  if (!query) return recents ?? []; // إذا الحقل فارغ عرض السجل
  if ( results && results.length > 0)return results; // إذا توفرت نتائج عرضها فوراً
  return suggestions??[]; // وإلا عرض الاقتراحات
};

const currentList = getActiveList();

// 2. تحديد العناصر المرئية بناءً على القائمة المختارة
const limit = isExpanded?currentList.length:10;
const visibleItems = currentList.slice(0,limit);
//const removeRecent = (id) => {
  //  setRecents(prev => prev.filter(item => item.id !== id));
  //};
const handleSearchConfirm=()=>{
  if(query.term() !==''){
    executeSearch(true);
    setIsSearching(true);
    setIsExpanded(true);
  }
}
const handleKeyDown = (e) => {
    if(e.key==='Enter'){
        
        setIsSearching(true);
        handleSearchConfirm();
        
    }
  };
 // منطق الإغلاق عند الضغط خارجاً
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // منطق مراقبة الإدخال (التحويل لتاغ إذا بدأ بـ #)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsSearching(false);

    if (value.startsWith('#')) {
      setActiveTab('Tags');
    } else  {
     activeTab==='People' }
    if (value==''){setIsExpanded(false)}
    if (value.length > 0) setIsOpen(true);
  };

  return (
    <div className="relative w-[95%] max-w-[32rem] md:max-w-[40rem] mx-auto p-[2%]" dir={isRtl?'rtl':'ltr'} ref={dropdownRef}>
      <div className="relative">
      <input
        type="text"
        dir='auto'
        placeholder={t('Search')}
        className={`w-full py-[0.6rem] pl-14 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 
            focus:ring-blue-500 bg-gray-100 text-gray-900 md:text-lg font-semibld  placeholder-gray-700 
            dark:text-dark-text dark:bg-dark-second-background dark:border-gray-700 dark:placeholder-gray-400
            ${isRtl?'md:pr-[12%] pl-4 text-right':'md:pl-[14%] pr-4 text-left'} `}
        value={query}
        onFocus={()=>setIsOpen(true)}
        onChange={handleInputChange }
        onKeyDown={handleKeyDown}
      />
       <IoSearchSharp className={`absolute top-1/2 transition-colors transform -translate-y-1/2 h-[1.5rem] w-[1.5rem] md:w-[1.8rem] md:h-[1.8rem] text-gray-700  
        dark: text-dark-text z-10 ${isRtl?'right-[4%]':'left-[4%]'}`}  />
       </div>
      

      {/* النافذة المنبثقة */}
      {isOpen && (
      <div className="absolute top-full mt-[2%] w-full bg-white dark:bg-dark-post-background left-1/2 -translate-x-1/2
           w-[300px] sm:w-[450px] md:w-[600px] max-w-[80vw] shadow-2xl rounded-[1rem] border border-gray-100 
            dark:border-gray-700   dark:bg-dark-post-background z-50 overflow-hidden ">
        {/* Tabs */}
        <div className="flex justify-around  py-1">
          {['people', 'tags', 'posts'].map(tab => (
            <button
              key={tab}
              onClick={() =>{ 
                setActiveTab(tab);
                setIsExpanded(false);}
              }
              className={`flex-1 py-[3%] md:py-[2%] md:text-[1rem] text-[0.9rem] font-bold  ${activeTab === tab ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                 : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        <div className={`py-[4%] px-[3%] dir='auto' text-start  transition-all duration-300
         ${query ? 'max-h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar': '' }`}>
          {/* حالة 1: عرض السجل (عندما يكون الحقل فارغاً) */}
          {!query&&currentList.length>0 && (
            <div>
              <p className="text-base md:text-lg font-bold text-gray-800 mb-[3%]  px-[9%] dark:text-gray-400 ">{t('recents')}</p>
              {visibleItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-[2%] px-[9%] group
                dark:hover:bg-dark-second-background cursor-pointer">
                  <div className="flex items-center gap-[0.7rem]">
                    {activeTab === 'people' ? (
                      <img src={item.img} className="w-9 h-9 rounded-full object-cover" alt="" />
                    ) : (
                      <MdHistory className="text-gray-600 dark:text-gray-600 w-[1.2rem] h-[1.2rem]" />
                    )}
                    <span className="text-[0.95rem] md:text-[1rem] font-bold text-gray-600 dark:text-dark-text">{item.name || item.title}</span>
                  </div>
                  <IoClose 
                    onClick={(e) =>{ e.stopPropagation(); deleteRecent(item.id)}}
                    className=" text-red-500 opacity-0 text-[1.2rem] cursor-pointer group-hover:opacity-100 transition-all" 
                  />
                </div>
              ))}
            </div>
          )}

          {/* حالة 2: عرض نتائج البحث */}
          {query && (
            <div>
              {isSearching &&  (
              <p className="text-base md:text-lg font-bold text-gray-800 mb-[3%] px-[9%]">{t('results')} : {currentList?.length || 0}</p>)}
              {visibleItems.map((item) => (
                <div
                onClick={() => saveHistory(item.id, activeTab)} 
                key={item.id} 
                className="flex items-center gap-[2%] py-[3%] border-b border-gray-50 last:border-0 hover:bg-gray-50 px-[9%] rounded-[1rem]
                 transition-colors dark:hover:bg-dark-50 dark:hover:bg-dark-second-background cursor-pointer">
                 {/* إذا كان التبويب هو تاغات أو منشورات، نستدعي المكون المنفصل */}
                 {(activeTab === 'tags' || activeTab === 'posts') && (
                 <div className="mb-3 cursor-pointer hover:opacity-90 transition-opacity">
                <PostSearchResult item={item} />
                </div>
                 )}
                  {activeTab === 'people' && (
                    <>
                      <img 
                       src={item.personal_photo_url || 'default-avatar.png'} 
                       className="w-[2.5rem] h-[2.5rem] md:w-[3.5rem] md:h-[3.5rem] rounded-full border border-gray-200 dark:border-gray-700" alt="" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[0.5rem]">
                          <span className="text-[0.9rem] md:text-[1.1rem] font-bold text-gray-600 dark:text-white ">{item.username}</span>
                          <span className="text-[0.7rem] md:text-[0.8rem] text-gray-600 dark:text-gray-400">{t('. following')}</span>
                        </div>
                        <p className="text-[0.75rem] md:text-[0.85rem] text-gray-500 dark:text-gray-400">{item.role}</p>
                      </div>
                    </>
                  )}
                  
                  {activeTab !== 'people' && (
                    <span className="text-[0.9rem] font-bold text-gray-900 dark:text-white">{activeTab === 'tags' ? `# ${item.username}` : item.title}</span>
                  )}
                </div>
                ))}
              
              {/* Pagination Button */}
              { !isExpanded &&currentList?.length >10 && (
               <div className='text-center mt-[4%] mb-[2%] px-[2%]'>
                <button className="w-full py-[3%] md:py-[2%] text-blue-600 dark:text-blue-400  text-[0.9rem]
                 md:text-[1rem] font-bold mt-[4%] hover:underline transition-all cursor:pointer " 
                onClick={()=>setIsExpanded(true)}>
                 {t(' show more results')}
                </button>
               </div>
              )}
            </div>
          )}
        </div>
      </div>)}
    </div>
  );
};

export default SearchDropdown;