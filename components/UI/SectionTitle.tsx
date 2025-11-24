import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'dark' | 'light';
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  align = 'center',
  theme = 'light'
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  const textColor = theme === 'light' ? 'text-primary' : 'text-white';
  const subtitleColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';

  return (
    <div className={`mb-12 ${alignClass} animate-fade-in`}>
      <h2 className={`text-3xl md:text-4xl font-serif font-bold ${textColor} mb-4`}>
        {title}
      </h2>
      <div className={`w-16 h-1 bg-secondary mb-6 ${align === 'center' ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className={`text-lg font-sans ${subtitleColor} max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;