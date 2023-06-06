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

if not os.path.exists(directory):
    os.makedirs(directory)
    print(f"Directory '{directory}' created.")

reference_imgs = {}
for directory_name in os.listdir(directory):
    folder_path = os.path.join(directory, directory_name)
    if os.path.isdir(folder_path):
        image_files = [file for file in os.listdir(folder_path) if file.lower().endswith((".jpg", ".jpeg", ".png"))]
        reference_imgs[directory_name.capitalize()] = [cv2.imread(os.path.join(folder_path, file)) for file in image_files]

def save_frame(frame, person, directory):
    folder_path = os.path.join(directory, person.lower())
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    counter = len(os.listdir(folder_path)) + 1
    filename = f"{person.capitalize()}_{counter}.jpg"  # Save with capitalized person's name
    file_path = os.path.join(folder_path, filename)
    cv2.imwrite(file_path, frame)
    print(f"Saved frame for {person} in {file_path}")

def compare_images(frame):
    recognized_person = "Unknown"
    try:
        for person, images in reference_imgs.items():
            for reference_img in images:
                if DeepFace.verify(frame, reference_img.copy())['verified']:
                    recognized_person = person
                    save_frame(frame, person, directory)  # Save the recognized frame
                    break
            if recognized_person != "Unknown":
                break
    except ValueError:
        pass
    return recognized_person

def save_image(image, filename):
    file_path = os.path.join(directory, filename)
    image.save(file_path)
    print(f"Image saved at {file_path}")

def update_reference_images():
    reference_imgs.clear()
    for directory_name in os.listdir(directory):
        folder_path = os.path.join(directory, directory_name)
        if os.path.isdir(folder_path):
            image_files = [file for file in os.listdir(folder_path) if file.lower().endswith((".jpg", ".jpeg", ".png"))]
            reference_imgs[directory_name.capitalize()] = [cv2.imread(os.path.join(folder_path, file)) for file in image_files]

@app.route('/checkFace', methods=['POST'])
def hello():
    update_reference_images()
    #app.logger.debug('Request JSON: %s', request.get_json())
    if 'image' in request.get_json():
        image_data = request.get_json()['image']
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        recognized_person = compare_images(cv_image)
        
        return jsonify({'recognized_person': recognized_person})
    else:
        return jsonify({'message': 'No image received!'})

@app.route('/createFace', methods=['POST'])
def create_face():
    if 'image' in request.get_json():
        image_data = request.get_json()['image']
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        person = request.get_json()['username']
        folder_path = os.path.join(directory, person.lower())
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        counter = len(os.listdir(folder_path)) + 1
        filename = f"{person.capitalize()}_{counter}.jpg" 

        file_path = os.path.join(folder_path, filename)
        image.save(file_path)

        update_reference_images()

        return jsonify({'message': 'Image saved successfully'})
    else:
        return jsonify({'message': 'No image received!'})

if __name__ == '__main__':
    app.run(debug=True)
