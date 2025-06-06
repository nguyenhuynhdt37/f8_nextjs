import React from 'react';
import { FiCheck } from 'react-icons/fi';

interface LevelsProps {
  level: {
    id: number;
    name: string;
  };
  levelChoise: number | undefined;
  onChoiseCourse: (id: number) => void;
}

const Levels: React.FC<LevelsProps> = ({ level, levelChoise, onChoiseCourse }) => {
  const isSelected = level?.id === levelChoise;

  return (
    <div
      onClick={() => onChoiseCourse(level?.id)}
      className={`
        relative p-2 rounded-md border transition-all cursor-pointer text-[10px]
        ${isSelected
          ? 'border-indigo-500 bg-indigo-50 shadow-sm'
          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center">
        <div
          className={`
            w-3 h-3 rounded-full mr-1.5 flex items-center justify-center
            ${isSelected ? 'bg-indigo-500' : 'border border-gray-300'}
          `}
        >
          {isSelected && <FiCheck className="text-white text-[8px]" />}
        </div>
        <span className="font-medium text-gray-800">{level?.name}</span>
      </div>
    </div>
  );
};

export default Levels;
