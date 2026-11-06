import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';

interface SearchInputProps {
  className: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
}

/**
 * Рендерить контрольоване поле пошуку.
 * @param props - Значення поля, presentation та callbacks зміни, фокуса й кліку.
 * @returns Текстове поле, налаштоване для пошуку варіантів.
 */
const SearchInput = ({
  className,
  value,
  placeholder,
  onChange,
  onFocus,
  onClick,
}: SearchInputProps) => (
  <input
    className={className}
    type="text"
    value={value}
    placeholder={placeholder}
    aria-label="Пошук варіантів"
    autoComplete="off"
    onClick={onClick}
    onFocus={onFocus}
    onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
  />
);

export default SearchInput;
