import type { ChangeEvent, FocusEvent } from 'react';

interface SearchInputProps {
  className: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
}

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
