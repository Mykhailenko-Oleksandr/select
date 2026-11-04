import { useEffect, useRef, useState } from 'react';
import css from './CustomSelect.module.css';

export type SelectOption = {
  label: string | number;
  value: string | number;
};

interface SingleSelectProps {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
}

interface MultipleSelectProps {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
}

type SelectProps = {
  containerClassName?: string;
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

const CustomSelect = ({ multiple, containerClassName, options, value, onChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function onSelect(option: SelectOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }

    setIsOpen(false);
  }

  function onClear() {
    if (multiple) {
      onChange([]);
    } else {
      onChange(undefined);
    }
  }

  function isSelectedOption(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }

  function renderSelectedValue() {
    if (multiple) {
      return value.length > 0
        ? value.map((v) => (
            <button
              type="button"
              key={v.value}
              className={css.valueBtn}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(v);
              }}
            >
              {v.label}
              <svg width={8} height={8}>
                <use href="icons.svg#icon-close"></use>
              </svg>
            </button>
          ))
        : 'Оберіть варіанти';
    } else {
      return value ? value.label : 'Оберіть варіант';
    }
  }

  useEffect(() => {
    const container = containerRef.current;

    const pressKeyHandler = (e: KeyboardEvent) => {
      if (!container || !container.contains(e.target as Node)) return;

      switch (e.code) {
        case 'Enter':
        case 'Space':
          e.preventDefault();

          if (!isOpen) {
            setIsOpen(true);
          } else {
            const option = options[highlightedIndex];
            if (option) {
              onSelect(option);
            }
          }
          break;
        case 'ArrowUp':
        case 'ArrowDown': {
          e.preventDefault();

          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);

          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case 'Escape':
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
          }
          break;
      }
    };

    container?.addEventListener('keydown', pressKeyHandler);

    return () => {
      container?.removeEventListener('keydown', pressKeyHandler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      className={`${css.wrap} ${containerClassName ?? ''}`}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      onClick={() => {
        setHighlightedIndex(0);
        setIsOpen((prev) => !prev);
      }}
    >
      <span className={css.textValue}>{renderSelectedValue()}</span>

      <div className={css.btnsBox}>
        <button
          type="button"
          className={css.clearBtn}
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <svg width={14} height={14}>
            <use href="icons.svg#icon-close"></use>
          </svg>
        </button>

        <div className={css.divider}></div>

        <div className={`${css.arrowBtn} ${isOpen ? css.isOpen : ''}`}>
          <svg width={12} height={12}>
            <use href="icons.svg#icon-caret"></use>
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul className={css.listBox}>
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`${css.option} ${isSelectedOption(option) ? css.isSelected : ''} 
              ${highlightedIndex === index ? css.isHighlighted : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(option);
              }}
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
