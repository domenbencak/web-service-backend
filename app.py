from flask import Flask, request, jsonify
import base64
import logging
import io
from PIL import Image
import cv2
import os
import time
from deepface import DeepFace
import numpy as np

app = Flask(__name__)

# Configure logging
#logging.basicConfig(filename='app.log', level=logging.DEBUG) # RUNS THE SERVER IN DEBUG MODE

"""@app.route('/', methods=['POST'])
def hello():
    app.logger.debug('Request JSON: %s', request.get_json())
    if 'image' in request.get_json():
        image_data = request.get_json()['image']
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        # Save the image to disk or process it as needed
        return {'message': 'Image received!'}
    else:
        return {'message': 'No image received!'}"""

#changed something so I can commit everything to a new branch
directory = "images"  # Directory where images will be saved

def save_image(image, filename):
    file_path = os.path.join(directory, filename)
    image.save(file_path)
    print(f"Image saved at {file_path}")

def find_most_confident_image(given_picture_path, directory_path):
    distance_scores = {}

    for root, dirs, files in os.walk(directory_path):
        for file in files:
            image_path = os.path.join(root, file)

            distance = calculate_confidence(given_picture_path, image_path)
            distance_scores[file] = distance

    most_confident_image = min(distance_scores, key=distance_scores.get)
    if(min(distance_scores, key=distance_scores.get) > 0.38):
        most_confident_image = "Unknown"
    return most_confident_image

def calculate_confidence(img1_path, img2_path):
    result = DeepFace.verify(img1_path, img2_path)
    distance = result['distance']
    print(f"{img2_path} distance is {distance}")
    return distance

@app.route('/checkFace', methods=['POST'])
def hello():
    #app.logger.debug('Request JSON: %s', request.get_json())
    if 'image' in request.get_json():
        image_data = request.get_json()['image']
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        # Save the image to a temporary file
        temp_image_path = "temp_image.png"
        image.save(temp_image_path)

        most = find_most_confident_image(temp_image_path, "images")

        os.remove(temp_image_path)

        #cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        #recognized_person = compare_images(cv_image)

        response_string = most.split(".")[0]
        
        return jsonify({'recognized_person': response_string})
    else:
        return jsonify({'message': 'No image received!'})

@app.route('/createFace', methods=['POST'])
def create_face():
    if 'image' in request.get_json():
        image_data = request.get_json()['image']
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        person = request.get_json()['username']

        save_image(image, f"{person}.jpg")

        """folder_path = os.path.join(directory, person.lower())
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        counter = len(os.listdir(folder_path)) + 1
        filename = f"{person.capitalize()}_{counter}.jpg" 

        file_path = os.path.join(folder_path, filename)
        image.save(file_path)"""

        return jsonify({'message': 'Image saved successfully'})
    else:
        return jsonify({'message': 'No image received!'})

if __name__ == '__main__':
    app.run(debug=True)