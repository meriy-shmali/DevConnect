import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useFollow } from '@/hook/UseFollow'
import MenuPanel from './Sidepanel/MenuPanel'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { usePostActions } from '@/hook/UsePostMutation'
import 'dayjs/locale/ar';
import { useTranslation } from 'react-i18next';
import { UseMe } from '@/hook/UseQueryMe'

dayjs.extend(relativeTime);

const HeaderPost = ({ post, customClass = '',isInProfilePage = false }) => {
  const { data } = UseMe()
  const { followMutation, unfollowMutation } = useFollow();
  const navigate = useNavigate()
  const [menu, setMenu] = useState({});
  const [iconSize, setIconSize] = useState(window.innerWidth >= 768 ? 20 : 16);

  useEffect(() => {
    const handleResize = () => setIconSize(window.innerWidth >= 768 ? 20 : 16);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (id) => setMenu(prev => ({ ...prev, [id]: !prev[id] }));

  const { i18n, t } = useTranslation();
  const [isfollowing, setisfollowing]         = useState(post.is_following);
  const [isInitiallyFollowing]                = useState(post.is_following);

  useEffect(() => { setisfollowing(post.is_following); }, [post.is_following]);

  const handleFollow = (e) => {
    e.stopPropagation();
    if (isfollowing) {
      setisfollowing(false);
      unfollowMutation.mutate(post.user.id, { onError: () => setisfollowing(true) });
    } else {
      setisfollowing(true);
      followMutation.mutate(post.user.id,   { onError: () => setisfollowing(false) });
    }
  }

  const formattedDate = post.created_at
    ? dayjs(post.created_at).locale(i18n.language).fromNow()
    : '';

  const handleEditPost   = () => { if (post?.id) navigate(`/edit-post/${post.id}`); };
  const { updateMutation, deleteMutation } = usePostActions();
  const handleDeletePost = async () => {
    if (post?.id) {
      try { await deleteMutation.mutateAsync(post.id); }
      catch (err) { console.error("Delete Error:", err); }
    }
  };

  const shouldShowFollowLogic =
    post.user?.id &&!isInProfilePage&&
    Number(post.user?.id) !== Number(data?.id) &&
    isInitiallyFollowing === false;

  const getProfilePath = (targetId) =>
    Number(targetId) === Number(data?.id) ? '/profile/me' : `/profile/${targetId}`;

  return (
    <div className={`flex justify-between items-center w-full gap-2 ${customClass}`}>

      {/* ── الجانب الأيسر: صورة + اسم + تاريخ + متابعة ── */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <img
          src={post.user?.personal_photo_url || "/images/default avatar1.jpg"}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer object-cover flex-shrink-0"
          onClick={() => navigate(getProfilePath(post.user?.id))}
          onError={(e) => { e.target.src = "/images/default avatar1.jpg" }}
          alt="avatar"
        />

        <div className="flex flex-col md:flex-row md:items-center md:gap-3 min-w-0">
          <div className="min-w-0">
            <p
              className="font-semibold text-sm md:text-md dark:text-white truncate cursor-pointer"
              onClick={() => navigate(getProfilePath(post.user?.id))}
            >
              {post.user?.username}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-[10px]">{formattedDate}</p>
          </div>

          {shouldShowFollowLogic && (
            <div className="mt-1 md:mt-0 flex-shrink-0">
              <button
                onClick={handleFollow}
                className={`px-2.5 py-1 text-[10px] md:text-xs rounded-md  transition whitespace-nowrap ${
                  isfollowing
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

      {/* ── الجانب الأيمن: نوع المنشور + قائمة ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`rounded-full border px-2.5 py-1 flex-shrink-0 whitespace-nowrap ${
          post.post_type === 'question'    ? 'text-hover-question border-hover-question'       :
          post.post_type === 'project'     ? 'text-hover-project border-hover-project'         :
          post.post_type === 'information' ? 'text-hover-information border-hover-information' :
          post.post_type === 'article'     ? 'text-hover-articles border-hover-articles'       :
          'text-black border-black'
        }`}>
          {post?.post_type && (
            <p className="text-xs md:text-sm font-medium">
              {t(`post_types.${post.post_type}`, post.post_type)}
            </p>
          )}
        </div>

        {Number(post.user?.id) === Number(data?.id) && (
          <MenuPanel
            id={post.id}
            menu={menu}
            toggleMenu={toggleMenu}
            size={iconSize}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        )}
      </div>
    </div>
  )
}

export default HeaderPost