import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';

// Label is the name of the numeric input, minValue and maxValue is the range of acceptable input
// callback is the function passed from 'Form.tsx' to send the updated state to the parent

interface NumFieldProps {
  label: string;
  callback: Function;
  minValue: number;
  maxValue?: number;
}

/**
 * This function returns a numeric textfield input component, along with the proper error and state handling
 *
 * @param props An object including label and acceptable values for the numeric field, along with function to send state to parent
 * @returns Material UI's TextField->Number component
 */
export default function SelectInput(props: NumFieldProps) {
  // To keep track of numerical value inputted by the user
  const [val, setVal] = React.useState(props.minValue);

  // Returns an error string based on whether the number is below or above the min and max values
  const errorString: Function = () => {
    let result: string = '';

    // If both min and max values are given
    if (props.maxValue !== undefined) {
      if (val < props.minValue || val > props.maxValue)
        result =
          'Please enter value between ' + props.minValue + '-' + props.maxValue;
    }
    // If only a min value is given
    else if (val < props.minValue)
      result = 'Please enter value greater than ' + props.minValue;

    return result;
  };

  // Returns whether the number entered is valid based on the given range
  const checkError: Function = () => {
    let result: boolean = false;

    // If both min and max are given
    if (props.maxValue !== undefined)
      result = val < props.minValue || val > props.maxValue;
    // If only min value is given
    else result = val < props.minValue;

    return result;
  };

  // When the user enters a new number, update the state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVal(parseInt(event.target.value));
  };

  // Once state is updated and the entered value is valid, send it back to parent
  useEffect(() => {
    if (!checkError()) props.callback(props.label, val);
  }, [val]);

  return (
    <TextField
      id="outlined-number"
      label={props.label}
      type="number"
      value={val}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{ inputProps: { min: props.minValue, max: props.maxValue } }}
      onChange={handleChange}
      error={checkError()}
      helperText={errorString()}
    />
  );
}
