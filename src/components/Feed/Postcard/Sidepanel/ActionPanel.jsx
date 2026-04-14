import React from 'react'

const ActionPanel = ({
  item,
  istranslate,
  handleTranslate,
  handleReplyClick,
  handleViewreply,
  replydata,
  t
}) => {

  return (
    <div className="flex text-sm text-gray-500 dark:text-gray-300 space-x-4 ml-10 p-2">
      <button onClick={() => handleReplyClick(item)}>
       { t("reply")}
      </button>

      <button onClick={() => handleViewreply(item.id)}>
        {replydata[item.id]?.length || 0} {t("View")}
      </button>
        <button onClick={() => handleTranslate(item)}>
        {istranslate[item.id] ? t("see_original") : t("translate")}
      </button>

    </div>
  );
}

export default ActionPanel