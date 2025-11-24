import React  from "@heroicons/react";
const NotificationItem = ({name,type,date,avatarUrl})=>{
    const getNotificationText=()=>{
        switch(type) {
            case 'followed':
              return `followed you`;
            case 'liked':
              return `liked your post`;
            case 'commented ':
              return `commented on your post`;
            case 'replied':
              return `replied on your post`;
            default:
              return 'had an interaction';

        }
    };
    return(
          <div className="flex items-center space-x-3 flex-row-reverse dir='rtl' space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
      <img
        src={avatarUrl}
        alt={`${name} avatar`}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-grow text-right">
        <p className="text-sm">
          <span className="font-semibold text-gray-800">{name}</span>{' '}
          <span className="text-gray-600">{getNotificationText()}</span>
        </p>
        {/* النص في الصورة باللغة العربية: "منذ لحظات" يمكن استبداله بمتغير التاريخ/الوقت */}
        <p className="text-xs text-gray-400 mt-0.5">{date}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
    