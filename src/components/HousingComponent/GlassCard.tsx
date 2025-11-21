import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hover = true 
}) => {
  return (
    <div
      className={`
        relative
        bg-white/70 backdrop-blur-md
        border border-bordergray/50
        rounded-2xl
        shadow-lg shadow-gray-400/10
        ${hover ? 'hover:shadow-xl hover:shadow-mainColor/10 hover:border-primaryColor/30 hover:-translate-y-1' : ''}
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {children}
    </div>
  );
};

