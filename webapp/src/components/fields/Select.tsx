import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Label is the name of the Select input, options are the unique input values from 'feature_values.tsx'
// callback is the function passed from 'Form.tsx' to send the updated state of the Select input to the parent

interface SelectProps {
  label: string;
  callback: Function;
  options: string[];
}

/**
 * This function returns a Select dropdown input component, along with state handling
 *
 * @param props An object including label and values for the Select dropdown, along with function to send state to parent
 * @returns Material UI's Autocomplete Select component
 */
export default function Select(props: SelectProps) {
  // To keep track of which value is selected by the user
  const [selected, setSelected] = React.useState('');

  // When the user selects another value, update the state accordingly
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    setSelected(value);
  };

  // Once the state is updated, return its value back to the parent using the callback function provided as a prop
  useEffect(() => {
    props.callback(props.label, selected);
  }, [selected]);

  // Sources from Material UI's Select->Autocomplete documentation
  return (
    <Autocomplete
      freeSolo
      options={props.options}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} label={props.label} />}
    />
  );
}
