import React, { useState } from 'react';
import { Grid, Box, Container, Button } from '@material-ui/core';
import CheckboxInput from './fields/Checkbox';
import NumericInput from './fields/Numeric';
import SelectInput from './fields/Select';
import * as FormValues from './FormValues';

/**
 * This function adds multiple form fields consisting of dropdown, checkbox and numerical input
 * Once all fields are properly inputted, the state of each field is sent to the Flask server
 * The values of these fields will be used as new data to predict the house sale price using the ML model built in 'train_model.ipynb'
 *
 * @returns Form with various Material UI Select, Checkbox and Numerical input components
 */
export default function FormInput() {
  // Keeps track of all field values entered by the user in an Object
  const [vals, setVals] = useState(FormValues.inputDefaultValues);

  // Keeps track of the predicted value sent by the Flask server
  const [prediction, setPrediction] = useState('💤💤💤');

  // Function that updates the field values Object whenever any field's state changes
  // Sent as a prop to all input fields that update the parent (this) when state of child (fields) change
  const handleFieldChange = (name: string, value: any) => {
    setVals({ ...vals, [name]: value });
  };

  // Returns if an input field content has remain unchanged from the default value
  const validate: Function = (name: string) => {
    return vals[name] === FormValues.inputDefaultValues[name];
  };

  // Handles what happen when the user submits the form content via 'Predict' button
  const handleSubmit = async () => {
    // Assume the form is correct as default
    let result = true;

    // If any of the form field values is the same as the default, form is incorrect
    for (
      let element = 0;
      element < FormValues.nonCheckboxFields.length;
      element++
    ) {
      if (validate(FormValues.nonCheckboxFields[element])) result = false;
    }

    // Only continue with the server request if the form is properly inputted
    if (result) {
      setPrediction('Loading...');

      console.log(vals);

      // Send POST request to the Flask server with the body as the field values in JSON format
      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http:localhost:3000/',
        },
        body: JSON.stringify(vals),
      });

      // Wait for reply from the server and convert it to JSON
      const reply = await response.json();

      // If the resulting value is very large, then that means the model saw the feature combinations for first time (like unmatching neighbourhood and market region)
      if (parseInt(reply.result) > 100000000)
        setPrediction('Invalid feature combination');
      // Otherwise, display the predicted value from ML model
      else setPrediction('Prediction: $' + reply.result);
    }

    // Otherwise, let the user know they haven't inputted all fields properly
    else {
      setPrediction('Missing/Incorrect values');
    }
  };

  // Add all of the respective form fields using Material UI input components, along with the proper props
  // as well as the submit button and box that displays the predicted value by ML model
  return (
    <>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            minWidth: '80vh',
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <CheckboxInput label="Pool" callback={handleFieldChange} />
            </Grid>

            <Grid item xs={4}>
              <CheckboxInput label="Basement" callback={handleFieldChange} />
            </Grid>

            <Grid item xs={4}>
              <CheckboxInput
                label="Basement Finish"
                callback={handleFieldChange}
              />
            </Grid>

            <Grid item xs={4}>
              <CheckboxInput label="Fireplace" callback={handleFieldChange} />
            </Grid>

            <Grid item xs={4}>
              <CheckboxInput
                label="Attached Garage"
                callback={handleFieldChange}
              />
            </Grid>

            <Grid item xs={4}>
              <CheckboxInput
                label="Detached Garage"
                callback={handleFieldChange}
              />
            </Grid>

            <Grid item xs={4}>
              <CheckboxInput
                label="Air Conditioning"
                callback={handleFieldChange}
              />
            </Grid>

            <Grid item xs={4}>
              <CheckboxInput
                label="Multiple Residences"
                callback={handleFieldChange}
              />
            </Grid>

            <Grid item xs={4}>
              <NumericInput
                label="Rooms"
                callback={handleFieldChange}
                minValue={0}
                maxValue={100}
              />
            </Grid>

            <Grid item xs={4}>
              <NumericInput
                label="Year Built"
                callback={handleFieldChange}
                minValue={1850}
                maxValue={2022}
              />
            </Grid>

            <Grid item xs={4}>
              <NumericInput
                label="Total Living Area (sq.ft)"
                callback={handleFieldChange}
                minValue={0}
              />
            </Grid>

            <Grid item xs={4}>
              <NumericInput
                label="Assessed Land Area (sq.ft)"
                callback={handleFieldChange}
                minValue={0}
              />
            </Grid>

            <Grid item xs={4}>
              <NumericInput
                label="Total Assessed Value"
                callback={handleFieldChange}
                minValue={0}
              />
            </Grid>

            <Grid item xs={4}>
              <NumericInput
                label="Sewer Frontage Measurement"
                callback={handleFieldChange}
                minValue={0}
              />
            </Grid>

            <Grid item xs={4}>
              <NumericInput
                label="Water Frontage Measurement"
                callback={handleFieldChange}
                minValue={0}
              />
            </Grid>

            <Grid item xs={4}>
              <SelectInput
                options={FormValues.neighbourhoods}
                callback={handleFieldChange}
                label="Neighbourhood Area"
              />
            </Grid>

            <Grid item xs={4}>
              <SelectInput
                options={FormValues.zones}
                callback={handleFieldChange}
                label="Zoning"
              />
            </Grid>

            <Grid item xs={4}>
              <SelectInput
                options={FormValues.months}
                callback={handleFieldChange}
                label="Sale Month"
              />
            </Grid>

            <Grid item xs={4}>
              <SelectInput
                options={FormValues.streetType}
                callback={handleFieldChange}
                label="Street Type"
              />
            </Grid>

            <Grid item xs={4}>
              <SelectInput
                options={FormValues.buildingType}
                callback={handleFieldChange}
                label="Building Type"
              />
            </Grid>

            <Grid item xs={4}>
              <SelectInput
                options={FormValues.marketRegion}
                callback={handleFieldChange}
                label="Market Region"
              />
            </Grid>

            <Grid item xs={4}>
              <SelectInput
                options={FormValues.propertyUseCode}
                callback={handleFieldChange}
                label="Property Use Code"
              />
            </Grid>

            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={4}
            >
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Predict
                </Button>
              </Grid>

              <Grid item xs={4}>
                <Box
                  component="div"
                  sx={{
                    display: 'inline',
                    p: 1,
                    m: 1,
                    border: '1px solid',
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: '700',
                  }}
                >
                  {prediction}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
