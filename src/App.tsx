import { useState } from 'react';
import css from './App.module.css';
import CustomSelect, { type SelectOption } from './components/CustomSelect/CustomSelect';

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

  return (
    <div className={css.container}>
      <CustomSelect
        options={options}
        value={selectedValue}
        onChange={(value) => setSelectedValue(value)}
      />
      <br />

      <CustomSelect
        multiple
        options={options}
        value={selectedValues}
        onChange={(value) => setSelectedValues(value)}
      />
    </div>
  );
};

export default App;
