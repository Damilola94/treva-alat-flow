import { HighStatus, LowStatus, MediumStatus } from '@/app/assets/svgs';
import React from 'react';

type PriorityLevel = 'High' | 'Medium' | 'Low'
type StatusType = 'Pending' | 'Due' | 'Completed'
type TransactionType = 'Credit' | 'Debit'
type LabelType = PriorityLevel | StatusType | TransactionType

interface LabelProps {
  type: 'priority' | 'status' | 'type'
  value: LabelType
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Label: React.FC<LabelProps> = ({
  type,
  value,
  className = '',
  showIcon = false,
  size = 'md'
}) => {
  const sizeClasses: Record<NonNullable<LabelProps['size']>, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const priorityConfig = {
    High: {
      style: 'border border-[#262626] bg-[#F6F6F6]',
      icon: <HighStatus />,
    },
    Medium: {
      style: 'border border-[#262626] bg-[#F6F6F6]',
      icon: <MediumStatus />,
    },
    Low: {
      style: 'border border-[#262626] bg-[#F6F6F6]',
      icon: <LowStatus />,
    },
  };

  const statusConfig = {
    Pending: {
      style: 'bg-[#FEF6E7] text-[#865503]',
    },
    Due: {
      style: 'bg-[#FBEAE9] text-[#9E0A05]',
    },
    Completed: {
      style: 'bg-[#E7F6EC] text-[#036B26]',
    },
  };

  const transactionConfig = {
    Credit: {
      style: 'text-[#06B340]',
    },
    Debit: {
      style: 'text-[#E7211B]'
    },
  }

  const isPriority = type === 'priority';
  const isStatus = type === 'status';

  const config = isPriority
    ? priorityConfig[value as PriorityLevel]
    : isStatus
      ? statusConfig[value as StatusType]
      : transactionConfig[value as TransactionType];

  const style = config?.style ?? 'bg-gray-100 text-gray-800';
  const icon = isPriority ? priorityConfig[value as PriorityLevel]?.icon : null;

  const selectedSizeClass = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${selectedSizeClass} ${style} ${className}`}
    >
      {showIcon && icon && <span className="mr-1.5">{icon}</span>}
      {value}
    </span>
  );
};

export { Label };
