import React from 'react'
import { AiOutlineDislike,AiOutlineLike } from 'react-icons/ai';
const ReactionPanel = ({ id, counts, handleReaction }) => {
 return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        <p>{counts[id]?.useful || 0}</p>
        <button onClick={() => handleReaction(id, "like")}>
          <AiOutlineLike />
        </button>
      </div>

      <div className="flex items-center space-x-1">
        <p>{counts[id]?.not_useful || 0}</p>
        <button onClick={() => handleReaction(id, "dislike")}>
          <AiOutlineDislike />
        </button>
      </div>
    </div>
  );
}

export default ReactionPanel