interface SelectActionsProps {
  containerClassName?: string;
  clearBtnClassName?: string;
  dividerClassName?: string;
  caretClassName?: string;
  onClear: () => void;
}

const SelectActions = (props: SelectActionsProps) => {
  const { containerClassName, clearBtnClassName, dividerClassName, caretClassName, onClear } =
    props;

  return (
    <div className={containerClassName}>
      <button
        type="button"
        className={clearBtnClassName}
        aria-label="Очистити вибір"
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
      >
        <svg width={14} height={14}>
          <use href="icons.svg#icon-close"></use>
        </svg>
      </button>

      <div className={dividerClassName} />

      <div className={caretClassName}>
        <svg width={12} height={12}>
          <use href="icons.svg#icon-caret"></use>
        </svg>
      </div>
    </div>
  );
};

export default SelectActions;
