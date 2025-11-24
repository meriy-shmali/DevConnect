// src/components/NotificationSidebar.jsx
import React from 'react';
import NotificationItem from './NotificationItem';
import { IoCloseOutline } from 'react-icons/io5'; // أيقونة الإغلاق

// بيانات وهمية للإشعارات
const mockNotifications = [
  { id: 1, name: 'meriy', type: 'followed', date: 'منذ لحظات', avatarUrl: '/avatars/avatar1.jpg' },
  { id: 2, name: 'Ritta', type: 'liked', date: 'منذ لحظات', avatarUrl: '/avatars/rita.jpg' },
  { id: 3, name: 'sara', type: 'commented', date: 'منذ لحظات', avatarUrl: '/avatars/avatar2.jpg' },
  { id: 4, name: 'shahd', type: 'replied', date: 'منذ لحظات', avatarUrl: '/avatars/avatar3.jpg' },
  { id: 5, name: 'karen', type: 'followed', date: 'منذ لحظات', avatarUrl: '/avatars/avatar4.jpg' },
  { id: 6, name: 'karen', type: 'liked', date: 'منذ لحظات', avatarUrl: '/avatars/avatar4.jpg' },
];

const NotificationSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay للخلفية (يغلق القائمة عند النقر خارجها) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } lg:hidden} // لا يظهر على الشاشات الكبيرة`}
        onClick={onClose}
      ></div>

      {/* شريط الإشعارات الجانبي */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:static lg:h-auto lg:w-96 lg:translate-x-0 lg:shadow-none lg:border-l lg:border-gray-200 lg:p-4`}
        style={{ direction: 'rtl' }} // لتأمين اتجاه النص من اليمين لليسار
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            notification
          </h2>
          {/* أيقونة الجرس في الصورة */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-500"
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
          
          {/* زر الإغلاق يظهر فقط على الأجهزة الصغيرة */}
          <button onClick={onClose} className="lg:hidden text-gray-600 hover:text-gray-900">
            <IoCloseOutline className="h-7 w-7" />
          </button>
        </div>

        {/* قائمة الإشعارات */}
        <div className="overflow-y-auto h-[calc(100vh-64px)] lg:h-auto pb-4">
          {mockNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              name={notification.name}
              type={notification.type}
              date={notification.date}
              avatarUrl={notification.avatarUrl}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;