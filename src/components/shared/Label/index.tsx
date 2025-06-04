import { HighStatus, LowStatus, MediumStatus } from '@/app/assets/svgs';
import React from 'react';

type PriorityLevel = 'High' | 'Medium' | 'Low'
type StatusType = 'Pending' | 'Due' | 'Completed' | 'ToDo' | 'AwaitingClientConfirmation' | 'RequestingRevision' | 'Paid' |'Over due' | 'Closed'
type TransactionType = 'Credit' | 'Debit'
type LabelType = PriorityLevel | StatusType | TransactionType

interface LabelProps {
  type: 'priority' | 'status' | 'type'
  value: LabelType
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  mapOverride?: Record<number, LabelType>
}

const priorityMap: Record<number, PriorityLevel> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
};

export const transactionMap: Record<number, TransactionType> = {
  1: 'Debit',
  2: 'Credit'

}


export const projectTypeMap: Record<number, string> = {
  1: 'Personal',
  2: 'Client',
};

const statusMap: Record<number, StatusType> = {
  1: 'ToDo',
  2: 'Pending',
  8: 'Due',
  4: 'Completed',
  9: 'AwaitingClientConfirmation',
  10: 'RequestingRevision',
  3: 'Closed',
  5: 'Paid',
  6: 'Over due',
};



const Label: React.FC<LabelProps> = ({
  type,
  value,
  className = '',
  showIcon = false,
  size = 'md',
  mapOverride
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
    ToDo: {
      style: 'bg-[#56A17B] text-[#0A4C8D]',
    },
    Pending: {
      style: 'bg-[#FEF6E7] text-[#865503]',
    },
    Due: {
      style: 'bg-[#FBEAE9] text-[#9E0A05]',
    },
    Completed: {
      style: 'bg-[#E7F6EC] text-[#036B26]',
    },
    AwaitingClientConfirmation: {
      style: 'bg-[#E76F51] text-[#3C3C3C]'
    },
    RequestingRevision: {
      style: 'bg-[#E76E51] text-[#3C3C3C]'
    },
    Paid: {
    style: 'bg-[#D1FADF] text-[#027A48]'
  },
  'Over due': {
    style: 'bg-[#FFE4E4] text-[#B42318]'
  },
  Closed: {
    style: 'bg-[#EAECF0] text-[#344054]'
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

   let displayValue = value;
  if (type === 'priority' && typeof value === 'number') {
    displayValue = priorityMap[value] || value;
  }
 if (typeof value === 'number') {
  if (type === 'priority') {
    displayValue = priorityMap[value] || value;
  } else if (type === 'status') {
    displayValue = mapOverride?.[value] || statusMap[value] || value;
  }
  else if (type === 'type') {
    displayValue = mapOverride?.[value] || transactionMap[value] || value;
  }
}

  const isPriority = type === 'priority';
  const isStatus = type === 'status';

  const config = isPriority
    ? priorityConfig[displayValue as PriorityLevel]
    : isStatus
      ? statusConfig[displayValue as StatusType]
      : transactionConfig[displayValue as TransactionType];

  const style = config?.style ?? 'bg-gray-100 text-gray-800';
  const icon = isPriority ? priorityConfig[displayValue as PriorityLevel]?.icon : null;

  const selectedSizeClass = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${selectedSizeClass} ${style} ${className}`}
    >
      {showIcon && icon && <span className="mr-1.5">{icon}</span>}
      {displayValue}
    </span>
  );
};

export { Label };
