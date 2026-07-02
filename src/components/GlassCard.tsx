import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glowEffect = false,
  onClick,
}) => {
  const cardClasses = `
    neumorph-card p-5 relative overflow-hidden
    ${hoverEffect ? 'neumorph-card-hover cursor-pointer' : ''}
    ${glowEffect ? 'border-brand-primary/20' : ''}
    ${className}
  `;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${cardClasses} w-full text-left focus:outline-none focus:ring-1 focus:ring-brand-primary/40`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};
