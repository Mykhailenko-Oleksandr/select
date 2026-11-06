import type { RefObject } from 'react';
import type { SelectOption } from '../CustomSelect.types';
import css from '../CustomSelect.module.css';

interface OptionsListProps {
  id: string;
  className: string;
  options: SelectOption[];
  multiple?: boolean;
  optionRefs: RefObject<Array<HTMLLIElement | null>>;
  isSelected: (option: SelectOption) => boolean;
  getOptionClassName: (option: SelectOption, index: number) => string;
  onSelect: (option: SelectOption) => void;
  onHighlight: (index: number) => void;
}

/**
 * Рендерить доступні варіанти як семантичний listbox.
 * @param props - Стан listbox, стан відображення варіантів і callbacks взаємодії.
 * @returns Listbox із елементами варіантів, доступними для вибору.
 */
const OptionsList = ({
  id,
  className,
  options,
  multiple,
  optionRefs,
  isSelected,
  getOptionClassName,
  onSelect,
  onHighlight,
}: OptionsListProps) => (
  <ul
    id={id}
    className={className}
    role="listbox"
    aria-multiselectable={multiple || undefined}
  >
    {options.length === 0 && (
      <li className={css.noResults} role="status">
        Результатів не знайдено
      </li>
    )}

    {options.map((option, index) => (
      <li
        key={option.value}
        id={`${id}-option-${index}`}
        ref={(element) => {
          optionRefs.current[index] = element;
        }}
        className={getOptionClassName(option, index)}
        role="option"
        aria-selected={isSelected(option)}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(option);
        }}
        onMouseEnter={() => onHighlight(index)}
      >
        {option.label}
      </li>
    ))}
  </ul>
);

export default OptionsList;
