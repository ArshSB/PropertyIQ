"""

This file consists of a single function that takes in the React form data as a dictionary (from JSON) and returns back the predicted house sale value.
It performs the same One Hot Encoding and Scaling transformations that the model's training data underwent in the Jupyter notebooks.
It also ensures the final '0s and 1s' dataframe that goes into the model is in the same format as the training data was.
This is required as the model expects the test data to be in the same format as the training data that it was trained on, otherwise it simply won't work.

"""

from joblib import load
import pandas as pd


# Dictionary to convert the month feature (given from the React frontend) to its corresponding index (to match the format of the training data)

months = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12
}

# Input is expected to be a dictionary


def get_prediction(input):

    # Convert the features with 'True' and 'False' values to 'Yes' and 'No' to match the format of the training data

    for key, value in input.items():

        if type(value) == bool:

            if value == True:
                input[key] = 'Yes'

            else:
                input[key] = 'No'

    # Holds the nominal categorical features in the same order as the training data on which the model was trained on

    ohe = {
        'Basement': input['Basement'],
        'Rooms': input['Rooms'],
        'Pool': input['Pool'],
        'Fire Place': input['Fireplace'],
        'Attached Garage': input['Attached Garage'],
        'Detached Garage': input['Detached Garage'],
        'Basement Finish': input['Basement Finish'],
        'Air Conditioning': input['Air Conditioning'],
        'Multiple Residences': input['Multiple Residences'],
        'Sale Year': 2021,
        'Sale Month': months[input['Sale Month']],
        'Market Region': input['Market Region'],
        'Neighbourhood Area': input['Neighbourhood Area'],
        'Street Type': input['Street Type'],
        'Zoning': input['Zoning'],
        'Property Use Code': input['Property Use Code'],
        'Building Type': input['Building Type'],
    }

    # Holds the numerical features in the same order as well

    num = {
        'Year Built': input['Year Built'],
        'Total Living Area': input['Total Living Area (sq.ft)'],
        'Assessed Land Area': input['Assessed Land Area (sq.ft)'],
        'Total Assessed Value': input['Total Assessed Value'],
        'Sewer Frontage Measurement': input['Sewer Frontage Measurement'],
        'Water Frontage Measurement': input['Water Frontage Measurement']
    }

    # Load the One Hot Encoder and the Standard Scaler from the Jupyter notebooks

    ohe_encoder = load('../model/notebooks/joblib/ohe.joblib')
    scaler = load('../model/notebooks/joblib/num.joblib')

    # Convert both OHE and NUM dictionaries to a dataframe, with proper column names

    ohe_df = pd.DataFrame([list(ohe.values())], columns=list(ohe.keys()))
    num_df = pd.DataFrame([list(num.values())], columns=list(num.keys()))

    # Transform the OHE and NUM dataframe into what the model understands using the loaded One Hot Encoder and Scaler

    ohe_df = pd.DataFrame(ohe_encoder.transform(ohe_df))
    ohe_df.columns = ohe_encoder.get_feature_names_out(
        input_features=list(ohe.keys()))

    num_df = pd.DataFrame(scaler.transform(num_df))
    num_df.columns = scaler.get_feature_names_out(
        input_features=list(num.keys()))

    # Combine the OHE and NUM dataframe in same order as the training dataset

    prediction = pd.concat([ohe_df, num_df], axis=1)

    # Load up the Linear Regression model and make a single prediction

    model = load('../model/notebooks/joblib/model.joblib')
    sale_price = model.predict(prediction)

    # Return the integer value back to be displayed on the frontend
    return sale_price[0]
