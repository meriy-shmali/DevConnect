import React from 'react'

const RepliesList = ({
  parentId,
  level,
  replydata,
  renderItem
}) => {
  
    return replydata[parentId]?.map(reply =>
    renderItem(reply, level)
  );
  
}

export default RepliesList