import type { SelectOption } from "./CustomSelect.types";

export function isSameOption(first: SelectOption, second?: SelectOption) {
    return first.value === second?.value;
}
  
export function getActiveIndex(
  currentIndex: number,
  optionsLength: number
): number {
  return optionsLength === 0
    ? 0
    : Math.min(currentIndex, optionsLength - 1);
}

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