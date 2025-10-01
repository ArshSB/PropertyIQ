import React, { useEffect } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

// Label is the name of the checkbox input
// callback is the function passed from 'Form.tsx' to send the updated state of the Select input to the parent

interface CheckboxProps {
  label: string;
  callback: Function;
}

/**
 * This function returns a checkbox input component, along with state handling
 *
 * @param props An object including label for the input and a function to send state to parent
 * @returns Material UI's Checkbox component
 */
export default function CheckboxInput(props: CheckboxProps) {
  // To keep track of checbox state (true or false)
  const [checked, setChecked] = React.useState(false);

  // When the user checks or unchecks the input, update state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // Once state is updated, send it back to parent
  useEffect(() => {
    props.callback(props.label, checked);
  }, [checked]);

  // Sourced from Material UI checkbox documentation
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        }
        label={props.label}
      />
    </FormGroup>
  );
}
