import React, { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean
  onClose: (id: string) => void
  children: ReactNode
  className?: string
  from: 'right' | 'middle'
}

export function AnimatedModal ({ isOpen, onClose, children, from, className = '' }: ModalProps) {
  if (!isOpen) return null;

  const animationClass =
    from === 'right'
      ? 'animate-slide-in-right'
      : 'animate-fade-in-glow';

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[50]"
      onClick={() => onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg transition-transform duration-300 z-50 ${animationClass} ${className}`}
        onClick={(e) => { e.stopPropagation(); }}
      >
        {children}
      </div>
    </div>
  );
}
