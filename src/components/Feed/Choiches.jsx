import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion';

const Choiches = ({ setCategory }) => {
  const { t ,i18n} = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
const isRtl = i18n.language === "ar";
  const tabs = [
    { id: 'all',         label: t('all'),         color: 'text-gray-500'           },
    { id: 'question',    label: t('questions'),    color: 'text-hover-question'     },
    { id: 'article',     label: t('article'),      color: 'text-hover-articles'     },
    { id: 'project',     label: t('projects'),     color: 'text-hover-project'      },
    { id: 'information', label: t('information'),  color: 'text-hover-information'  },
  ];

  const handleCategoryChange = (id) => { setActiveTab(id); setCategory(id); };

  return (
    <div className={`flex items-center md: gap-5 md:gap-12 lg:gap-12 xl:gap-24 xl:pe-[30%] lg:pe-6 ${isRtl?"pe-26":"pe-4"} md:px-4 md:pe-7  justify-center    md:py-5 mt-16 md:mt-0`}>
      {tabs.map((tab) => (
        <div key={tab.id} className="relative group">
          <button
            onClick={() => handleCategoryChange(tab.id)}
            className={`relative pb-1.5 text-sm md:text-2xl font-semibold title-font transition-all duration-300 ${tab.color}`}
          >
            {tab.label}

            {activeTab === tab.id && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0  start-0 end-0 h-0.5 bg-current rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {activeTab !== tab.id && (
              <div className="absolute bottom-0 start-0 w-0 h-0.5 bg-current opacity-20 rounded-full transition-all duration-300 group-hover:w-full" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Choiches