'use client';

import { SearchIcon } from '@/app/assets/svgs';
import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  isInputField?: boolean;
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  touched?: any;
}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, name, ...props }, ref) => {
    return (
      <div className="relative w-full max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon className="w-4 h-4 text-gray-400" />
        </span>
        <input
          type="text"
          ref={ref}
          name={name}
          className={cn(
            'w-full border bg-transparent border-[#0000001A] pl-10 pr-4 py-2 rounded-full placeholder:text-sm placeholder:text-gray-400',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
