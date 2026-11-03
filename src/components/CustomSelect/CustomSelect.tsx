import css from "./CustomSelect.module.css";

export type SelectOption = {
  label: string | number;
  value: string | number;
};

interface CustomSelectProps {
  containerClassName?: string;
  options: SelectOption[];
  value?: SelectOption;
  onChange?: (value: SelectOption | undefined) => void;
}

const CustomSelect = ({
  containerClassName,
  options,
  value,
  onChange,
}: CustomSelectProps) => {
  return (
    <div
      className={`${css.wrap} ${containerClassName ?? ""}`}
      tabIndex={0}>
      <span className={css.textValue}>
        {value ? value.label : "Оберіть варіант"}
      </span>
      <div className={css.btnsBox}>
        <button
          type="button"
          className={css.clearBtn}>
          <svg
            width={10}
            height={10}>
            <use href="icons.svg#icon-close"></use>
          </svg>
        </button>
        <div className={css.divider}></div>
        <button
          type="button"
          className={css.arrowBtn}>
          <svg
            width={10}
            height={10}>
            <use href="icons.svg#icon-caret"></use>
          </svg>
        </button>
      </div>
      <ul className={css.listBox}>
        {options.map((option) => (
          <li
            key={option.value}
            className={css.option}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomSelect;
