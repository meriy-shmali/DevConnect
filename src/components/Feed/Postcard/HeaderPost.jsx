import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useFollow } from '@/hook/UseFollow'
import MenuPanel from './Sidepanel/MenuPanel'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/ar';
import { useTranslation } from 'react-i18next';
import { UseMe } from '@/hook/UseQueryMe'

dayjs.extend(relativeTime);

const HeaderPost = ({ post }) => {
  const { data } = UseMe()
  const { followMutation, unfollowMutation } = useFollow();
  const navigate = useNavigate()
  const [menu, setMenu] = useState({});
   const [iconSize, setIconSize] = useState(window.innerWidth >= 768 ? 28 : 18);

  
  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth >= 768 ? 28 : 18);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (id) => {
    setMenu(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const { i18n, t } = useTranslation();

  const [isfollowing, setisfollowing] = useState(post.is_following);
  const [isInitiallyFollowing] = useState(post.is_following);

  useEffect(() => {
    setisfollowing(post.is_following);
  }, [post.is_following]);

  const handleFollow = (e) => {
    e.stopPropagation();
    if (isfollowing) {
      setisfollowing(false);            // ✅ يتغير فوراً
      unfollowMutation.mutate(post.user.id, {
        onError: () => setisfollowing(true)   // يرجع لو صار خطأ
      });
    } else {
      setisfollowing(true);             // ✅ يتغير فوراً
      followMutation.mutate(post.user.id, {
        onError: () => setisfollowing(false)  // يرجع لو صار خطأ
      });
    }
  }

  const formattedDate = post.created_at 
    ? dayjs(post.created_at).locale(i18n.language).fromNow() 
    : '';

  const shouldShowFollowLogic = 
    post.user?.id && 
    Number(post.user?.id) !== Number(data?.id) && 
    isInitiallyFollowing === false;

  return (
    <div className='flex justify-between items-start md:items-center w-full gap-2'>
      {/* القسم الأيسر: الصورة + معلومات المستخدم والزر */}
      <div className='flex items-start md:items-center space-x-3 md:space-x-5 min-w-0'>
        {/* الصورة الشخصية */}
        <img 
          src={post.user?.personal_photo_url || "/images/default avatar1.jpg"}
          className='w-11 h-11 md:w-15 md:h-15 rounded-full cursor-pointer object-cover flex-shrink-0' 
          onClick={() => navigate(`/profile/${post.user?.id}`)}
          onError={(e) => { e.target.src = "/images/default avatar1.jpg" }}
          alt="avatar"
        />
        
        {/* حاوية تجمع الاسم، التاريخ، وزر المتابعة */}
        <div className='flex flex-col md:flex-row md:items-center md:space-x-4 min-w-0'>
          <div className='min-w-0'>
            <div className='font-semibold text-[14px] md:text-xl dark:text-white break-all max-w-[150px] md:max-w-none'>
              {post.user?.username}
            </div>
            <div className='text-gray-600 dark:text-gray-400 text-[11px] md:text-sm'>
              {formattedDate}
            </div>
          </div>

          {/* زر المتابعة: يظهر تحت التاريخ في الموبايل، وبجانب البيانات في الديسكتوب */}
          {shouldShowFollowLogic && (
            <div className='mt-1.5 md:mt-0 flex-shrink-0'>
              <button
                onClick={handleFollow}
                className={`px-3 py-1 text-[10px] md:text-[15px] md:py-2 rounded-md font-semibold transition w-fit whitespace-nowrap
                  ${isfollowing
                    ? "border border-follow-button text-follow-button"
                    : "bg-follow-button text-white"
                  }`}
              >
                {isfollowing ? t('following') : t('follow')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* القسم الأيمن: التاج (نوع المنشور) + القائمة الثلاثية */}
      <div className='flex items-center space-x-2 md:space-x-3 flex-shrink-0'>
        <div className={`md:rounded-3xl rounded-full border md:p-1 flex-shrink-0 whitespace-nowrap ${
          post.post_type === 'question' ? 'text-hover-question border-hover-question' :
          post.post_type === 'project' ? 'text-hover-project border-hover-project' :
          post.post_type === 'information' ? 'text-hover-information border-hover-information' :
          post.post_type === 'article' ? 'text-hover-articles border-hover-articles' : 'text-black border-black'
        } w-fit md:w-[120px] text-center`}>
          {post?.post_type ? (
            <p className='text-[11px] md:text-xl py-0.5 px-2 md:px-0 font-medium'>
              {t(`post_types.${post.post_type}`, post.post_type)}
            </p>
          ) : null}
        </div>

        {Number(post.user?.id) === Number(data?.id) && (
          <MenuPanel
            id={post.id}
            menu={menu}
            toggleMenu={toggleMenu}
            size={iconSize}
          />
        )}
      </div>
    </div>
  )
}

export default HeaderPost