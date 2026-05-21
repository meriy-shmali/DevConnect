import { translate } from '@/api/Translate';
import React from 'react'

const ActionPanel = ({
  item,
  istranslate,
  handleTranslate,
  handleReplyClick,
  handleViewreply,
  replydata,repliesCount,pendingTranslateId,
  t
}) => {
   const isPending = pendingTranslateId === item.id;
   console.log("pendingTranslateId:", pendingTranslateId, "item.id:", item.id, "isPending:", isPending);
console.log(isPending)
  return (
    <div className="flex text-sm text-gray-500 dark:text-gray-300 space-x-4 ml-10 p-2">
      <button onClick={() => handleReplyClick(item)}>
       { t("reply")}
      </button>
   
      <button onClick={() => handleViewreply(item.id)}>
        {repliesCount} {t("View")}
      </button>
        <button onClick={() => handleTranslate(item)} disabled={isPending}>
         {isPending ? (
    <span>{t('translating')}...</span>
  ) : istranslate[item.id] ? (
    
    <span>{t("see_original")}</span>
  ) : (
    
    <span>{t("translate")}</span>
  )}
      </button>

    </div>
  );
}
/*<button className='text-sm text-gray-600 dark:text-gray-400'onClick={handletranslate} disabled={translate.isPending}>  {translate.isPending 
          ?   t('translating') + "..."
          : (isTranslate ? t('see_original') : t('translate')) */

export default ActionPanel