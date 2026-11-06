import type { SelectOption } from './CustomSelect.types';

/**
 * Порівнює два варіанти за їхнім стабільним значенням.
 * @param first - Варіант, що виступає джерелом порівняння.
 * @param second - Варіант для порівняння; може бути не визначений.
 * @returns Чи мають обидва варіанти однакове значення.
 */
export function isSameOption(first: SelectOption, second?: SelectOption): boolean {
    return first.value === second?.value;
}

/**
 * Перевіряє, чи вибраний варіант у поточному режимі.
 * @param option - Варіант, який потрібно перевірити.
 * @param value - Поточне контрольоване значення для одного або кількох варіантів.
 * @param multiple - Чи може поточне значення містити кілька вибраних варіантів.
 * @returns Чи вибраний переданий варіант.
 */
export function isSelectedOption(
  option: SelectOption,
  value: SelectOption | SelectOption[] | undefined,
  multiple: boolean
): boolean {
  if (!value) return false;
  if (multiple) {
    return Array.isArray(value)
      ? value.some((selectedOption) => isSameOption(selectedOption, option))
      : false;
  }

  return !Array.isArray(value) && isSameOption(option, value);
}

/**
 * Перетворює можливий застарілий індекс на доступний індекс варіанта.
 * @param currentIndex - Збережений індекс активного варіанта.
 * @param optionsLength - Кількість доступних варіантів.
 * @returns Допустимий індекс або нуль, якщо варіанти відсутні.
 */
export function getActiveIndex(
  currentIndex: number,
  optionsLength: number
): number {
  return optionsLength === 0
    ? 0
    : Math.min(currentIndex, optionsLength - 1);
}

/**
 * Сортує копію варіантів за назвою в алфавітному порядку.
 * @param options - Варіанти для сортування.
 * @returns Новий масив, відсортований без зміни початкового масиву.
 */
export function sortOptions(options: SelectOption[]): SelectOption[] {
  return [...options].sort((first, second) =>
    String(first.label).localeCompare(String(second.label), 'uk', {
      sensitivity: 'base',
    })
  );
}

/**
 * Фільтрує варіанти за назвою.
 * @param options - Доступні варіанти.
 * @param searchQuery - Текст пошуку, введений користувачем.
 * @returns Відфільтровані варіанти або початковий масив для порожнього запиту.
 */
export function filterOptions(
  options: SelectOption[],
  searchQuery: string
): SelectOption[] {
  const query = searchQuery.trim().toLowerCase();

  if (!query) return options;

  return options.filter((option) =>
    String(option.label).toLowerCase().includes(query)
  );
}