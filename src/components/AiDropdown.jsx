import React from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, PenTool, Code, Hash, LayoutGrid } from "lucide-react";

const AiDropdown = ({ actions }) => {
  const { t } = useTranslation();

  const menuItems = [
    { label: t("rephrase"), icon: <Sparkles size={16} />, onClick: actions.generate },
    { label: t("improve"), icon: <PenTool size={16} />, onClick: actions.improve },
    { label: t("summarize"), icon: <Code size={16} />, onClick: actions.summarize },
    { label: t("tags"), icon: <Hash size={16} />, onClick: () => actions.addTags() },
    { label: t("categorize"), icon: <LayoutGrid size={16} />, onClick: () => actions.categorize() },
  ];

  return (
    <div className="absolute top-full mt-2 w-56 overflow-hidden rounded-xl bg-gradient-background p-1 shadow-xl z-50 animate-in fade-in zoom-in duration-200">
      <div className="bg-transparent py-2">
        <div className="px-3 py-1 text-xs font-bold text-white/70 uppercase tracking-wider">
          {t("ai")}
        </div>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors rounded-lg mb-0.5 last:mb-0"
          >
            <span className="text-white/80">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AiDropdown;