import css from "./CustomSelect.module.css";

interface CustomSelectProps {
  containerClassName?: string;
}

const CustomSelect = ({ containerClassName }: CustomSelectProps) => {
  return (
    <div className={`${css.wrap} ${containerClassName ?? ""}`}>
      CustomSelect
    </div>
  );
};

export default CustomSelect;
