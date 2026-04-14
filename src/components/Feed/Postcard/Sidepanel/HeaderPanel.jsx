const HeaderPanel = ({ user, createdAt, type,level }) => {
  return (
    <div className="flex items-center space-x-3 relative">
     

      <img src={user?. personal_photo_url} className="w-10 h-10 rounded-full" />
      <div className="text-md font-semibold capitalize dark:text-gray-50">
        {user?.username}
      </div>
      {/* يظهر فقط بالتعليقات */}
      {type === "comments" && (
        <div className="text-sm text-gray-500 dark:text-gray-200">
          {createdAt}
        </div>
      )}
    </div>
  );
};

export default HeaderPanel;