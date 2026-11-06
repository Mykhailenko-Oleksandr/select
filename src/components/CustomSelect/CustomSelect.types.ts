export interface SelectOption {
  label: string | number;
  value: string | number;
}

interface SelectClassNames {
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
}

interface CustomSelectProps extends SelectClassNames {
  options: SelectOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
}

interface SingleSelectProps extends CustomSelectProps {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
}

interface MultipleSelectProps extends CustomSelectProps {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
}

export type SelectProps = SingleSelectProps | MultipleSelectProps;