"""

This file creates a simple Flask server with a single endpoint ('/') that listens for a POST request from the frontend
representing the form input in JSON format, and fulfills the GET request by sending back the model's predicted value

"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction import get_prediction

# Set up Flask server and enable CORS so that our frontend can communicate with this it
# See: https://stackoverflow.com/questions/25594893/how-to-enable-cors-in-flask

app = Flask(__name__)
cors = CORS(app)

# Set up a single endpoint at root
# Allow only GET (receive prediction value back) & POST (send form data) requests

@app.route("/", methods=["GET", "POST"])
def predict():

    # If a GET request is received without the form data, return error string
    response = 'INVALID'

    # If POST request is received as well, we can get the predicted sale price value
    if request.method == 'POST':

        # Get the form data in JSON
        data = request.get_json()

        # Get the prediction by sending the JSON data to our ML model
        response = get_prediction(data)

    # Return the response as JSON back to the frontend (could be error or integer string)
    return jsonify({"result": response})


# Start the server when command line "py server.py" is used
if __name__ == "__main__":
    app.run(debug=True)
