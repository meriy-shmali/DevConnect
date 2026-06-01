import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoPeople } from "react-icons/go";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useFollow } from '@/hook/UseFollow';
import { useTranslation } from 'react-i18next';
import { staticsuggestion } from '@/Utils/data/staticsuggestion';
import { UseSugesstion } from '@/hook/UseQuerySuggestion';
const Suggestion = () => {
  
  const { t } = useTranslation();
  const navigate = useNavigate();
const { data, isLoading } = UseSugesstion();
  //const [users, setusers] = useState(data || staticsuggestion);//منحذفو عند الربط مع الباك 
const [users, setusers] = useState([]);
  useEffect(() => {
    setusers(data);
  }, [data]);

  const { followMutation } = useFollow();

  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const visibleUsers = Array.isArray(users) 
  ? users.slice(startIndex, startIndex + itemsPerPage) 
  : [];

  const handleFollow = (id, e) => {
    const previousUsers = users;
    e.stopPropagation();
    setusers((prev) => prev.filter((u) => u.id !== id));

    followMutation.mutate(id, {
      onError: () => {
        setusers(previousUsers);
      },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🛠 fix index bug
  useEffect(() => {
  if (users && users.length > 0 && startIndex >= users.length) {
    setStartIndex(0);
  }
}, [itemsPerPage, users?.length]);
if (!users || users.length === 0) return null;
  return (
    <div className=''>
      <div className='flex ms-2 items-start md:text-xl text-[18px]  mt-10 font-semibold capitalize dark:text-dark-text'>
        {t('intersted')}:
      </div>

      {/* 📱 MOBILE: Swipe like Instagram */}
      <div className="flex md:hidden overflow-x-auto gap-4 px-2 mt-6 snap-x snap-mandatory scrollbar-hide">
        {users.map((user) => (
          <div
            key={user.id}
            className="min-w-[200px] bg flex-shrink-0 snap-center "
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            <div className='border border-gray-300 dark:border-0 p-5 rounded-2xl shadow-xl mb-6 w-fit  h-fit flex-col space-y-5 dark:bg-dark-post-background bg-white'>

              <div className='flex justify-center items-center space-x-4'>
                <img src={user.personal_photo_url} className='w-14 h-14 rounded-full'/>

                <div className="w-fit"> 
                  <p className="font-semibold md:text-sm text-xs capitalize truncate dark:text-gray-100">{user.username}</p>

                  <div className='flex items-center space-x-1 text-xs text-black dark:text-gray-100'>
                    <GoPeople />
                    <p>{user.followers_count}</p>
                  </div>
                </div>
              </div>

              <div className="flex-col justify-center items-center space-y-5">
                <div className="text-gray-500 text-center text-sm  dark:text-gray-200">
                        <p className="truncate w-[150px] px-2 capitalize" title={user.specialization}>
                          {user.specialization || t('no_specialization')}
                        </p>
                      </div>

                <button
                  onClick={(e) => handleFollow(user.id, e)}
                  className="bg-follow-button text-[14px] md:text-md text-white py-1 rounded-md w-full"
                >
                  {t('follow')}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* 💻 DESKTOP (Original Code with Arrows) */}
      <div className='hidden md:flex items-center mt-8 '>
        <div>
          {startIndex > 0 && (
            <button onClick={() => setStartIndex(prev => prev - itemsPerPage)}>
              <IoIosArrowBack className='md:text-[50px] text-[40px] text-gray-400'/>
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={startIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`flex space-x-4 ${
              visibleUsers.length < itemsPerPage ? "justify-start" : "justify-center"
            }`}
          >
            <AnimatePresence>
              {visibleUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >

                  <div className='border border-gray-300 dark:border-0 p-5 rounded-2xl shadow-xl mb-6 w-[240px]   h-fit flex-col space-y-5 dark:bg-dark-post-background bg-white'
                       onClick={() => navigate(`/profile/${user.id}`)}>

                    <div className='flex justify-center gap-7 items-center '>
                      <img src={user.personal_photo_url||'/public/images/default avatar1.jpg'} className='md:w-14 md:h-14 w-10 h-10 rounded-full'/>

                      <div className="w-fit flex-col  space-y-1.5 "> 
                        <p className="font-semibold md:text-md text-sm capitalize truncate dark:text-gray-50">
                          {user.username}
                        </p>

                        <div className='flex items-center space-x-1 text-md dark:text-gray-50 '>
                          <GoPeople />
                          <p>{user.followers_count}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-col justify-center items-center space-y-5">
                      <div className="text-gray-500 text-center text-sm  dark:text-gray-200">
                        <p className="truncate w-full px-2 capitalize" title={user.specialization}>
                          {user.specialization || t('no_specialization')}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleFollow(user.id, e)}
                        className="bg-follow-button text-white text-sm  py-1 rounded-md w-full"
                      >
                        {t('follow')}
                      </button>
                    </div>

                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <div>
          {startIndex + itemsPerPage < users.length && (
            <button onClick={() => setStartIndex(prev => prev + itemsPerPage)}>
              <IoIosArrowForward className='md:text-[50px] text-[24px] text-gray-400'/>
            </button>
          )}
        </div>

      </div>

    </div>
  )
}

export default Suggestion;
