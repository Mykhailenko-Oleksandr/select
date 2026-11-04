import { useState } from 'react';
import css from './CustomSelect.module.css';

export type SelectOption = {
  label: string | number;
  value: string | number;
};

interface CustomSelectProps {
  containerClassName?: string;
  options: SelectOption[];
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
}

const CustomSelect = ({ containerClassName, options, value, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  function onSelect(e: React.MouseEvent<HTMLLIElement>, option: SelectOption) {
    e.stopPropagation();

    if (option !== value) onChange(option);

    setIsOpen(false);
  }

  function onClear(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onChange(undefined);
  }

  function isSelectedOption(option: SelectOption) {
    return option === value;
  }

  return (
    <div
      className={`${css.wrap} ${containerClassName ?? ''}`}
      tabIndex={0}
      onClick={() => {
        setHighlightedIndex(0);
        setIsOpen((prev) => !prev);
      }}
      onBlur={() => setIsOpen(false)}
    >
      <span className={css.textValue}>{value ? value.label : 'Оберіть варіант'}</span>
      <div className={css.btnsBox}>
        <button type="button" className={css.clearBtn} onClick={(e) => onClear(e)}>
          <svg width={14} height={14}>
            <use href="icons.svg#icon-close"></use>
          </svg>
        </button>
        <div className={css.divider}></div>
        <button type="button" className={`${css.arrowBtn} ${isOpen ? css.isOpen : ''}`}>
          <svg width={12} height={12}>
            <use href="icons.svg#icon-caret"></use>
          </svg>
        </button>
      </div>

      {isOpen && (
        <ul className={css.listBox}>
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`${css.option} ${isSelectedOption(option) ? css.isSelected : ''} 
              ${highlightedIndex === index ? css.isHighlighted : ''}`}
              onClick={(e) => onSelect(e, option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
