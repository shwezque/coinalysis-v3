import React from 'react';
import { Star } from 'lucide-react';

interface StarButtonProps {
  tokenId: string;
  isStarred?: boolean;
  onToggle?: (tokenId: string) => void;
}

const StarButton: React.FC<StarButtonProps> = ({ tokenId, isStarred = false, onToggle }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle(tokenId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={`w-4 h-4 ${
          isStarred
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-400 dark:text-gray-600'
        }`}
      />
    </button>
  );
};

export default StarButton;