import css from '../CustomSelect.module.css';
import type { SelectOption } from '../CustomSelect.types';

type SelectValueProps = {
  valueBtnClassName?: string;
  onRemove: (option: SelectOption) => void;
} & (
  | { multiple: true; value: SelectOption[] }
  | { multiple?: false; value?: SelectOption }
);

const SelectValue = (props: SelectValueProps) => {
  const { valueBtnClassName, onRemove } = props;

  if (props.multiple) {
    if (!props.value.length) return 'Оберіть варіанти';

    return props.value.map((option) => (
      <button
        type="button"
        key={option.value}
        className={`${css.valueBtn} ${valueBtnClassName ?? ''}`}
        aria-label={`Видалити ${option.label}`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(option);
        }}
      >
        {option.label}
        <svg width={8} height={8}>
          <use href="icons.svg#icon-close"></use>
        </svg>
      </button>
    ));
  }

  return props.value?.label ?? 'Оберіть варіант';
};

export default SelectValue;
