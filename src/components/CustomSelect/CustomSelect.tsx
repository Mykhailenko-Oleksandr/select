import { useEffect, useRef, useState, useCallback, useId, useMemo, type FocusEvent } from 'react';
import css from './CustomSelect.module.css';
import type { SelectOption, SelectProps } from './CustomSelect.types';
import { filterOptions, getActiveIndex, isSameOption } from './CustomSelect.utils';
import SearchInput from './components/SearchInput';
import SelectValue from './components/SelectValue';
import SelectActions from './components/SelectActions';
import OptionsList from './components/OptionsList';
import { useSelectKeyboard } from './hooks/useSelectKeyboard';

const CustomSelect = (props: SelectProps) => {
  const {
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
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const listId = useId();

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;
    return filterOptions(options, searchQuery);
  }, [options, searchable, searchQuery]);

  const activeIndex = getActiveIndex(highlightedIndex, filteredOptions.length);

  const inputValue = isSearching ? searchQuery : !multiple && value ? String(value.label) : '';

  const inputPlaceholder =
    searchPlaceholder ??
    (multiple
      ? value.length === 0
        ? 'Оберіть варіанти'
        : 'Знайти'
      : value
        ? undefined
        : 'Оберіть варіант');

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

  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  function renderTextValue() {
    if (!searchable) {
      if (multiple) {
        return (
          <SelectValue
            multiple
            value={value}
            valueBtnClassName={valueBtnClassName}
            onRemove={(option) => onSelect(option)}
          />
        );
      }

      return (
        <SelectValue
          value={value}
          valueBtnClassName={valueBtnClassName}
          onRemove={(option) => onSelect(option)}
        />
      );
    }

    return (
      <>
        {multiple && value.length > 0 && (
          <SelectValue
            multiple
            value={value}
            valueBtnClassName={valueBtnClassName}
            onRemove={(option) => onSelect(option)}
          />
        )}

        <SearchInput
          className={`${css.searchInput} ${searchInputClassName ?? ''}`}
          value={inputValue}
          placeholder={inputPlaceholder}
          onChange={(value) => {
            setIsSearching(true);
            setSearchQuery(value);
            setHighlightedIndex(0);
            setIsOpen(true);
          }}
          onClick={(event) => event.stopPropagation()}
          onFocus={() => {
            setIsSearching(true);
            setHighlightedIndex(0);
            setIsOpen(true);
            if (!multiple && value && searchQuery === '') {
              setSearchQuery(String(value.label));
            }
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

  useSelectKeyboard({
    containerRef,
    isOpen,
    activeIndex,
    options: filteredOptions,
    onSelect,
    resetSearch,
    setIsOpen,
    setHighlightedIndex,
  });

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
        isOpen && filteredOptions[activeIndex]
          ? `${listId}-option-${activeIndex}`
          : undefined
      }
    >
      <span className={`${css.textValue} ${textBoxClassName ?? ''}`}>{renderTextValue()}</span>

      <SelectActions
        containerClassName={`${css.btnsBox} ${rightBtnsBoxClassName ?? ''}`}
        clearBtnClassName={`${css.clearBtn} ${clearBtnClassName ?? ''}`}
        dividerClassName={`${css.divider} ${dividerClassName ?? ''}`}
        caretClassName={`${css.arrowBtn} ${isOpen ? css.isOpen : ''} ${caretClassName ?? ''}`}
        onClear={onClear}
      />

      {isOpen && (
        <OptionsList
          id={listId}
          className={`${css.listBox} ${listBoxClassName ?? ''}`}
          options={filteredOptions}
          multiple={multiple}
          optionRefs={optionRefs}
          isSelected={isSelectedOption}
          getOptionClassName={(option, index) =>
            `${css.option} ${isSelectedOption(option) ? css.isSelected : ''}
            ${activeIndex === index ? css.isHighlighted : ''} ${optionClassName ?? ''}`
          }
          onSelect={onSelect}
          onHighlight={setHighlightedIndex}
        />
      )}
    </div>
  );
};

export default CustomSelect;
