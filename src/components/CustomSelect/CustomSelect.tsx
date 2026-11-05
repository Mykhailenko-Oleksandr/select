import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useId,
  useMemo,
  type FocusEvent,
} from 'react';
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
  textBoxClassName?: string;
  valueBtnClassName?: string;
  rightBtnsBoxClassName?: string;
  clearBtnClassName?: string;
  dividerClassName?: string;
  caretClassName?: string;
  listBoxClassName?: string;
  optionClassName?: string;
  searchInputClassName?: string;
  searchPlaceholder?: string;
  searchable?: boolean;

  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

const CustomSelect = ({
  multiple,
  containerClassName,
  textBoxClassName,
  valueBtnClassName,
  rightBtnsBoxClassName,
  clearBtnClassName,
  dividerClassName,
  caretClassName,
  listBoxClassName,
  optionClassName,
  searchInputClassName,
  searchPlaceholder,
  searchable = false,
  options,
  value,
  onChange,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const listId = useId();
  const filteredOptions = useMemo(
    () =>
      searchable
        ? options.filter((option) =>
            String(option.label).toLowerCase().includes(searchQuery.trim().toLowerCase())
          )
        : options,
    [options, searchable, searchQuery]
  );
  const activeIndex =
    filteredOptions.length === 0 ? 0 : Math.min(highlightedIndex, filteredOptions.length - 1);

  function isSameOption(first: SelectOption, second?: SelectOption) {
    return first.value === second?.value;
  }

  const onSelect = useCallback(
    (option: SelectOption) => {
      if (multiple) {
        if (value.some((selectedOption) => isSameOption(selectedOption, option))) {
          onChange(value.filter((selectedOption) => !isSameOption(selectedOption, option)));
        } else {
          onChange([...value, option]);
        }
      } else {
        if (!isSameOption(option, value)) onChange(option);
        setSearchQuery('');
        setIsSearching(false);
        setIsOpen(false);
      }
    },
    [multiple, onChange, value]
  );

  function onClear() {
    if (multiple) {
      onChange([]);
    } else {
      onChange(undefined);
    }
    setSearchQuery('');
    setIsSearching(false);
    setIsOpen(false);
  }

  function isSelectedOption(option: SelectOption) {
    return multiple
      ? value.some((selectedOption) => isSameOption(selectedOption, option))
      : isSameOption(option, value);
  }

  function renderSelectedValue() {
    if (multiple) {
      return value.length > 0
        ? value.map((v) => (
            <button
              type="button"
              key={v.value}
              className={`${css.valueBtn} ${valueBtnClassName ?? ''}`}
              aria-label={`Видалити ${v.label}`}
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

  function renderTextValue() {
    if (!searchable) return renderSelectedValue();

    return (
      <>
        {multiple && value.length > 0 && renderSelectedValue()}
        <input
          className={`${css.searchInput} ${searchInputClassName ?? ''}`}
          type="text"
          value={
            isSearching
              ? searchQuery
              : !multiple && value
                ? String(value.label)
                : ''
          }
          placeholder={
            searchPlaceholder ??
            (multiple
              ? value.length === 0
                ? 'Оберіть варіанти або знайдіть'
                : 'Знайти'
              : value
                ? undefined
                : 'Оберіть або знайдіть')
          }
          aria-label="Пошук варіантів"
          autoComplete="off"
          onClick={(event) => event.stopPropagation()}
          onFocus={() => {
            setIsSearching(true);
            setIsOpen(true);
            if (!multiple && value && searchQuery === '') {
              setSearchQuery(String(value.label));
            }
          }}
          onChange={(event) => {
            setIsSearching(true);
            setSearchQuery(event.target.value);
            setHighlightedIndex(0);
            setIsOpen(true);
          }}
        />
      </>
    );
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setIsOpen(false);
      setSearchQuery('');
      setIsSearching(false);
    }
  }

  useEffect(() => {
    const container = containerRef.current;

    const pressKeyHandler = (e: KeyboardEvent) => {
      if (!container || !container.contains(e.target as Node)) return;
      if ((e.target as HTMLElement).closest('button')) return;
    if ((e.target as HTMLElement).tagName === 'INPUT' && e.key.length === 1) {
      return;
    }

      switch (e.code) {
        case 'Enter':
        case 'Space':
          e.preventDefault();

          if (!isOpen) {
            setIsOpen(true);
          } else {
            const option = filteredOptions[Math.min(activeIndex, filteredOptions.length - 1)];
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

          if (filteredOptions.length === 0) break;

          const newValue =
            (activeIndex + (e.code === 'ArrowDown' ? 1 : -1) + filteredOptions.length) %
            filteredOptions.length;

          if (newValue >= 0 && newValue < filteredOptions.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }

        case 'Home':
          if (isOpen && filteredOptions.length > 0) {
            e.preventDefault();
            setHighlightedIndex(0);
          }

          break;

        case 'End':
          if (isOpen && filteredOptions.length > 0) {
            e.preventDefault();
            setHighlightedIndex(filteredOptions.length - 1);
          }

          break;

        case 'Escape':
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
            setSearchQuery('');
            setIsSearching(false);
          }
          break;
      }
    };

    container?.addEventListener('keydown', pressKeyHandler);

    return () => {
      container?.removeEventListener('keydown', pressKeyHandler);
    };
  }, [isOpen, activeIndex, filteredOptions, onSelect]);

  useEffect(() => {
    if (isOpen && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [isOpen, activeIndex]);

  return (
    <div
      ref={containerRef}
      className={`${css.wrap} ${containerClassName ?? ''}`}
      tabIndex={0}
      onBlur={handleBlur}
      onClick={() => {
        setHighlightedIndex(0);
        setIsOpen((prev) => !prev);
      }}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={listId}
      aria-activedescendant={
        isOpen && options[activeIndex] ? `${listId}-option-${activeIndex}` : undefined
      }
    >
      <span className={`${css.textValue} ${textBoxClassName ?? ''}`}>{renderTextValue()}</span>

      <div className={`${css.btnsBox} ${rightBtnsBoxClassName ?? ''}`}>
        <button
          type="button"
          className={`${css.clearBtn} ${clearBtnClassName ?? ''}`}
          aria-label="Очистити вибір"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <svg width={14} height={14}>
            <use href="icons.svg#icon-close"></use>
          </svg>
        </button>

        <div className={`${css.divider} ${dividerClassName ?? ''}`}></div>

        <div className={`${css.arrowBtn} ${isOpen ? css.isOpen : ''} ${caretClassName ?? ''}`}>
          <svg width={12} height={12}>
            <use href="icons.svg#icon-caret"></use>
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul
          id={listId}
          className={`${css.listBox} ${listBoxClassName ?? ''}`}
          role="listbox"
          aria-multiselectable={multiple || undefined}
        >
          {filteredOptions.map((option, index) => (
            <li
              id={`${listId}-option-${index}`}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              key={option.value}
              className={`${css.option} ${isSelectedOption(option) ? css.isSelected : ''} 
              ${activeIndex === index ? css.isHighlighted : ''} ${optionClassName ?? ''}`}
              role="option"
              aria-selected={isSelectedOption(option)}
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
