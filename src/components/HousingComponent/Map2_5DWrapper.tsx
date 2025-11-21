import React from 'react';

interface Map2_5DWrapperProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const Map2_5DWrapper: React.FC<Map2_5DWrapperProps> = ({ 
  children, 
  className = '',
  intensity = 'medium'
}) => {
  const perspectiveMap = {
    low: 'perspective-[800px]',
    medium: 'perspective-[1000px]',
    high: 'perspective-[1200px]'
  };

  return (
    <div
      className={`
        ${perspectiveMap[intensity]}
        transform-gpu
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};

