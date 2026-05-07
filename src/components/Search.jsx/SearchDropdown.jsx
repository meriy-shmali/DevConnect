import React, { useState,useRef,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@/hook/UseSearchMutation';
import PostSearchResult from './PostSearchResult'; // تأكدي من المسار الصحيح
import { IoClose,IoSearchSharp } from 'react-icons/io5'; // استيراد أيقونات
import { MdHistory } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const SearchDropdown = () => {
  const {t,i18n}=useTranslation();
  const navigate = useNavigate();
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
// داخل SearchDropdown
// 1. تصحيح دالة الحصول على القائمة
const getActiveList = () => {
  if (!query) return recents ?? []; 
  
  // إذا نجح طلب البحث، نأخذ المصفوفة من داخل الكائن results
  if (isSearching && results) {
    return results.results || []; 
  }
  
  // في حالة الاقتراحات أثناء الكتابة
  return suggestions?.results || suggestions || []; 
};

// 2. التعديل الهام: currentList يجب أن تأخذ القائمة مباشرة
const currentList = getActiveList() || [];
// هذا هو السطر الحاسم: يجب التأكد من أن currentList هي دائماً Array
//const currentList = Array.isArray(getActiveList()) ? getActiveList() : (getActiveList()?.results || []);

// 2. تحديد العناصر المرئية بناءً على القائمة المختارة
const limit = isExpanded?currentList.length:10;
const visibleItems = currentList.slice(0,limit);
//const removeRecent = (id) => {
  //  setRecents(prev => prev.filter(item => item.id !== id));
  //};
const handleSearchConfirm=()=>{
  if(query.trim() !==''){
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
const handleItemClick = (item) => {
  // 1. تبويب الأشخاص: ننتقل للملف الشخصي فوراً
  if (activeTab === 'people') {
    const userId = item.id || item.username;
    if (userId) {
      navigate(`/profile/${userId}`);
      saveHistory(userId, 'people');
      setIsOpen(false);
    }
    return;
  }

  // 2. تبويب البوستات أو التاغات
  const isObject = typeof item === 'object' && item !== null;
  
  // إذا ضغطنا على عنصر من "السجل" (الذي غالباً يكون نصاً أو كائناً يحتوي query)
  // أو إذا لم نكن في حالة "بحث فعال" (isSearching = false)
  if (!isSearching || !isObject) {
    const searchText = item.query || item.title || (typeof item === 'string' ? item : "");
    
    setQuery(searchText); // وضع النص في حقل البحث
    setIsSearching(true); // تفعيل حالة البحث
    executeSearch(1);     // تنفيذ البحث لجلب النتائج الحقيقية (التي ستظهر بتنسيق PostSearchResult)
  } else {
    // إذا ضغطنا على نتيجة بحث فعلية (كائن بوست كامل)
    navigate(`/post/${item.id}`, { state: { post: item } });
    saveHistory(item.id, activeTab);
    setIsOpen(false);
  }
};
  return (
    <div className="relative w-full md:max-w-2xl  mx-auto  py-2" dir={isRtl?'rtl':'ltr'} ref={dropdownRef}>
      <div className="relative">
      <input
        type="text"
        dir='auto'
        placeholder={t('Search')}
        className={`w-full py-2.5 ps-12 pe-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 
            focus:ring-blue-500 bg-gray-100 text-gray-900 md:text-lg font-semibld  placeholder-gray-700 
            dark:text-dark-text dark:bg-gray-50 dark:border-gray-800 dark:placeholder-gray-400 
             ${isRtl ? 'md:pr-16 pl-6 text-right' : 'md:pl-16 pr-6 text-left'}`}
        value={query}
        onFocus={()=>setIsOpen(true)}
        onChange={handleInputChange }
        onKeyDown={handleKeyDown}
      />
       <IoSearchSharp className={`absolute top-1/2 transition-colors transform -translate-y-1/2 h-6 w-6 md:w-7 md:h-7 text-gray-700  
        dark: text-dark-text z-10 ${isRtl?'right-4':'left-4'}`}  />
       </div>
      

      {/* النافذة المنبثقة */}
      {isOpen && (
      <div className="absolute top-full mt-1  bg-white dark:bg-dark-post-background left-1/2 -translate-x-1/2
           w-[75vw]  md:w-[600px] shadow-2xl rounded-2xl border border-gray-100 
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
              className={`flex-1 py-3 md:py-2 md:text-base text-sm font-bold  ${activeTab === tab ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                 : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        <div className={`py-4 px-3 dir='auto' text-start  transition-all duration-300
         ${query ? 'max-h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar': '' }`}>
          {/* حالة 1: عرض السجل (عندما يكون الحقل فارغاً) */}
          {!query&&currentList.length>0 && (
            <div>
              <p className="text-base md:text-lg font-bold text-gray-800 mb-3  px-8 dark:text-gray-400 ">{t('recents')}</p>
              {visibleItems.map((item) => (
                <div key={item.id}
                  onClick={() => {
                  if (activeTab === 'people') {
                 // ننتقل لصفحة البروفايل باستخدام اليوزرنيم القادم من السجل
                  navigate(`/profile/${item.id}`); 
                  setIsOpen(false); // إغلاق القائمة بعد الضغط
                  }
                  }} 
                className="flex items-center justify-between py-2 px-8 group
                dark:hover:bg-dark-second-background cursor-pointer">
                  <div className="flex items-center gap-3">
                    {activeTab === 'people' ? (
                      <img src={item.personal_photo_url ||item.img|| 'default-avatar.png'} className="w-9 h-9 rounded-full object-cover" alt="" />
                    ) : (
                      <MdHistory className="text-gray-600 dark:text-gray-400 w-5 h-5" />
                    )}
                    <span className="text-sm md:text-base font-bold text-gray-600 dark:text-gray-100">{item.username || item.title}</span>
                  </div>
                  <IoClose 
                    onClick={(e) =>{  e.stopPropagation(); if(item.id){deleteRecent(item.id)}}}
                    className=" text-red-500 opacity-0 text-xl cursor-pointer group-hover:opacity-100 transition-all" 
                  />
                </div>
              ))}
            </div>
          )}

          {/* حالة 2: عرض نتائج البحث */}
          {query && (
            <div>
              {isSearching &&  (
              <p className="text-base md:text-lg font-bold text-gray-800 mb-3 px-8">{t('results')} : {currentList?.length || 0}</p>)}
              {visibleItems.map((item,index) => (
                <div
                  onClick={() => handleItemClick(item)}
                    key={item.id || `suggest-${index}`}
                className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-8 rounded-2xl
                 transition-colors dark:hover:bg-dark-50 dark:hover:bg-dark-second-background cursor-pointer">
                 {/* إذا كان التبويب هو تاغات أو منشورات، نستدعي المكون المنفصل */}
                  {isSearching && (activeTab === 'posts' || activeTab === 'tags') ? (
                 <div className="mb-3 cursor-pointer hover:opacity-90 transition-opacity">
                <PostSearchResult item={item} />
                </div>
                  ):(
                    <>
                  {activeTab === 'people' && (
                    <>
                      <img 
                       src={item.personal_photo_url || 'default-avatar.png'} 
                       className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-200 dark:border-gray-700" alt="" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm md:text-base font-bold text-gray-600 dark:text-white ">{item.username}</span>
                          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t('. following')}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{item.role}</p>
                      </div>
                    </>
                  )}
                  
                  {activeTab !== 'people' && (
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{activeTab === 'tags' ? `# ${item.username}` : item.title}</span>
                  )}
                  </>
                  )}
                </div>
                ))}
              
              {/* Pagination Button */}
              { !isExpanded &&currentList?.length >10 && (
               <div className='text-center mt-4 mb-2 px-2'>
                <button className="w-full py-3 md:py-2 text-blue-600 dark:text-blue-400  text-sm
                 md:text-base font-bold mt-4 hover:underline transition-all cursor:pointer " 
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