import React, { useState, useRef, useEffect } from 'react';
import { IoSearchOutline, IoSearchSharp ,IoPersonAddSharp, IoSettingsSharp } from 'react-icons/io5';

// صورة افتراضية للمستخدم (Placeholder)
const NO_AVATAR = 'NO_AVATAR'; 
// يمكن استبدالها بمسار صورة افتراضية محلية 

// بيانات وهمية لنتائج البحث (للمحاكاة)
const DUMMY_SEARCH_RESULTS = [
  { id: 1, name: 'RittaMakdissi', avatar: NO_AVATAR },
    { id: 2, name: 'ShahdAlwaqqaf', avatar: NO_AVATAR },
  // يمكنك إضافة المزيد من النتائج هنا
];
const userAvatar='./public/images/login.jpg';
const userHasAvatar=userAvatar !== NO_AVATAR;
const renderAvatar=(avatarUrl,sizeClass)=>{
  if (avatarUrl===NO_AVATAR){return(<IoPersonAddSharp className={`${sizeClass} text-gray-400`}/>);
  }
return(<img className={`${sizeClass} rounded-full object-cover`} src={avatarUrl}/>)}
const Header = ({ onNotificationClick }) => {
  // 1. حالة لإدارة قيمة حقل البحث
  const [searchTerm, setSearchTerm] = useState('');
  // 2. حالة لإدارة ظهور القائمة المنسدلة للبحث
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // مرجع (ref) للمكون لتحديد ما إذا كان النقر خارج المكون
  const searchRef = useRef(null);
  
  // دالة لمعالجة النقر خارج حقل البحث لإغلاق القائمة المنسدلة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // إظهار القائمة المنسدلة إذا كان هناك أي نص مدخل
    setIsDropdownOpen(value.length > 0);
  };
  
  // سنفترض أن المستخدم لم يقم بتحميل صورته بعد، لذا نستخدم الصورة الافتراضية
  
  // إذا كنت تريد استخدام الصورة الفعلية بعد تسجيل الدخول: 
  // const userAvatar = userData.avatar || DEFAULT_AVATAR;


  return (
    <header className="bg-black shadow-lg shadow-2xl rounded-2xl border-b border-gray-200 sticky top-0 z-30 ">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" style={{ direction: 'ltr' }}>
        
        {/* 1. شعار التطبيق - DevConnect */}
        <div className="flex items-center ">
          <h1 className="text-4xl font-bold bg-clip-text text-gradient-custom">DevConnect</h1>
        </div>
        
        {/* 2. حاوية البحث والقائمة المنسدلة */}
        <div ref={searchRef} className="flex-grow flex justify-center mx-4 md:max-4 relative">
          <div className=" w-full md:max-w-sm  ">
            <div className="relative">
              {/* حقل البحث */}
              <input
                type="text"
                placeholder="search" 
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.length > 0 && setIsDropdownOpen(true)} // لإظهارها عند التركيز إذا كان هناك نص
                className="w-full py-2 pl-14 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100  text-lg font-semibld text-left placeholder-gray-700 "
                style={{ direction: 'ltr' }} // تأكد من أن البحث يبدأ من اليسار (Ltr)
              />
              <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-700"   />
            </div>

            {/* القائمة المنسدلة للبحث */}
            {isDropdownOpen && (
              <div className="absolute top-full  mt-2 w-full md:w-120 bg-white shadow-xl rounded-lg border border-gray-200 z-40 right-1/2 transform translate-x-1/2">
                <div className="p-4 ">
                  {DUMMY_SEARCH_RESULTS
                    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 space-x-reverse cursor-pointer p-2 hover:bg-gray-50 rounded-md transition duration-150">
                        {/* صورة الافاتار في نتيجة البحث */}
                        <img className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar}
                          alt={user.name}
                        />
                        {/* اسم المستخدم */}
                        <span className="text-gray-800 font-medium">{user.name}</span>
                      </div>
                    ))
                  }
                  {/* خط فاصل أسفل النتائج كما في الصورة */}
                  <hr className="my-2 border-gray-200" /> 
                  {/* يمكنك إضافة رسالة "لا توجد نتائج" إذا كانت القائمة فارغة */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. أيقونات الإشعارات والملف الشخصي */}
        {/* تم عكس الترتيب (Reverse) لـ space-x لضمان أن العناصر تظهر بالترتيب الصحيح (من اليسار لليمين: الإشعارات، الأفاتار) */}
        <div className="flex items-center space-x-2 space-x-reverse">
          
          {/* أيقونة الإشعارات */}
          <button 
            className="p-2 rounded-full hover:bg-gray-800 text-gray-300 relative transition duration-150"
            onClick={onNotificationClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-black"></span>
          </button>
          
          {/* أيقونة الملف الشخصي - تستخدم الصورة الافتراضية */}
          <button className="flex items-center p-0.5 rounded-full hover:bg-gray-800">
            {renderAvatar(userAvatar,'h-8 w-8')}
          </button>
          <button className='p-2 rounded-full hover:bg-gray-800 text-gray-300 transition duration-150'>
            <IoSettingsSharp className='h-6 w-6'/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;