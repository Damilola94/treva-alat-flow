import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  name?: string;
  value?: string; // external control
  options: Option[];
  placeholder?: string;
  onChange?: (option: Option, name?: string) => void;
  className?: string;
}

export function SelectField({
  label,
  name,
  value,
  options,
  placeholder = 'Select an option',
  onChange,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // auto update selectedOption based on `value` prop
    if (value) {
      const match = options.find((opt) => opt.value === value);
      setSelectedOption(match || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  const handleOptionClick = (option: Option) => {
    console.log(option);
    
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) onChange(option, name); // include name for forms
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`app_select ${className}`} ref={selectRef}>
      {label && <label className="app_input_con__lbl">{label}</label>}
      <div
        className={`mt-2 app_select-trigger ${
          isOpen ? 'app_select-trigger--active' : ''
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span
          className={`app_select-arrow ${
            isOpen ? 'app_select-arrow--open' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="app_select-dropdown h-56 !overflow-scroll">
          {options.map((option) => (
            <div
              key={option.value}
              className={`app_select-option ${
                selectedOption?.value === option.value
                  ? 'app_select-option--selected'
                  : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
