import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string
  label: string
}

interface SelectProps {
  options: Option[]
  placeholder?: string
  onChange?: (option: Option) => void
  className?: string
}

export function Select ({ options, placeholder = 'Select an option', onChange, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  const toggleDropdown = () => { setIsOpen((prev) => !prev); };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  return (
    <div className={`app_select ${className}`} ref={selectRef}>
      <div
        className={`app_select-trigger ${isOpen ? 'app_select-trigger--active' : ''}`}
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className={`app_select-arrow ${isOpen ? 'app_select-arrow--open' : ''}`} />
      </div>

      {isOpen && (
        <div className="app_select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`app_select-option ${
                selectedOption?.value === option.value ? 'app_select-option--selected' : ''
              }`}
              onClick={() => { handleOptionClick(option); }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
