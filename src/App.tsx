import { useState } from 'react';
import CustomSelect from './components/CustomSelect/CustomSelect';
import css from './App.module.css';
import type { SelectOption } from './components/CustomSelect/CustomSelect.types';

const options = [
  {
    label: 'First',
    value: 1,
  },
  {
    label: 'Second',
    value: 2,
  },
  {
    label: 'Third',
    value: 3,
  },
  {
    label: 'Fourth',
    value: 4,
  },
  {
    label: 'Fifth',
    value: 5,
  },
  {
    label: 'Sixth',
    value: 6,
  },
  {
    label: 'Seventh',
    value: 7,
  },
  {
    label: 'Eighth',
    value: 8,
  },
];

const App = () => {
  const [selectedValue, setSelectedValue] = useState<SelectOption | undefined>();
  const [selectedValues, setSelectedValues] = useState<SelectOption[]>([]);
  const [selectedValue2, setSelectedValue2] = useState<SelectOption | undefined>();
  const [selectedValues2, setSelectedValues2] = useState<SelectOption[]>([]);

  return (
    <div className={css.container}>
      <CustomSelect
        options={options}
        value={selectedValue}
        onChange={(value) => setSelectedValue(value)}
        containerClassName={css.wrapApp}
        searchable
      />

      <br />

      <CustomSelect
        multiple
        options={options}
        value={selectedValues}
        onChange={(value) => setSelectedValues(value)}
        containerClassName={css.multipleSelect}
        searchable
        searchPlaceholder={'Введіть ПІБ'}
      />

      <br />

      <CustomSelect
        options={options}
        value={selectedValue2}
        onChange={(value) => setSelectedValue2(value)}
        containerClassName={css.wrapApp}
      />

      <br />

      <CustomSelect
        multiple
        options={options}
        value={selectedValues2}
        onChange={(value) => setSelectedValues2(value)}
        containerClassName={css.multipleSelect}
      />
    </div>
  );
};

export default App;
