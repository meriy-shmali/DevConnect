import React from 'react'
import { AiOutlineDislike,AiOutlineLike } from 'react-icons/ai';
const ReactionPanel = ({ id, counts, handleReaction }) => {
 return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1 dark:text-gray-200">
        <p>{counts[id]?.useful || 0}</p>
        <button onClick={() => handleReaction(id, "useful")}>
          <AiOutlineLike />
        </button>
      </div>

      <div className="flex items-center space-x-1 dark:text-gray-200">
        <p>{counts[id]?.not_useful || 0}</p>
        <button onClick={() => handleReaction(id, "not_useful")}>
          <AiOutlineDislike />
        </button>
      </div>
    </div>
  );
}

export default ReactionPanel