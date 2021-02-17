from flask import json, Flask, render_template, make_response, send_file, request, redirect, flash, url_for, Response, jsonify
import urllib.request
from werkzeug.utils import secure_filename
# from app import app
import os
import sys
import logging
from flask_cors import CORS, cross_origin
from PIL import Image
import base64
from io import BytesIO
import shutil
from preprocess_image import detect_face
from io import BytesIO
from keras.models import load_model
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet_v2 import preprocess_input
import cv2

UPLOAD_FOLDER = 'static/uploads/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
GEN_FOLDER = 'static/generated_images'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# @app.route('/', methods=['GET', 'POST'])
# def index(): 
#     return render_template('index.html')

@app.route('/api/clear/')
def clear():

    path =  os.path.join(os.getcwd(), UPLOAD_FOLDER)
    if os.path.exists(path):
        shutil.rmtree(path)

    os.mkdir(UPLOAD_FOLDER)

    path =  os.path.join(os.getcwd(), GEN_FOLDER)
    if os.path.exists(path):
        shutil.rmtree(path)

    os.mkdir(GEN_FOLDER)

    return "Made directory"

@app.route('/api/upload/', methods=['POST'])
def fileUpload():
    # Decode and save original file
    global name 
    name = secure_filename(request.form.get('filename'))
    filename = os.path.join(UPLOAD_FOLDER, name)

    image_data = bytes(request.form.get('file'), encoding="ascii")
    im = Image.open(BytesIO(base64.b64decode(image_data))).convert('RGB')
    im.save(filename)

    # Preprocess image, make predictions
    gen_path, image_encoded, image = preprocess(filename)
    race, gender, age = predict(image)

    # Formulate Response
    data = {"pp_img": image_encoded, 
            "race": race,
            "gender": gender,
            "age": age
            }
    resp = app.response_class(
    status=200,
    response= json.dumps(data),
    mimetype='application/json'
        )
    return resp

def preprocess(file_path):
    gen_path = os.path.join(GEN_FOLDER, name)

    #Crop face
    image = detect_face(file_path)
    image.save(gen_path)

    img_str = encode_image(image)

    return gen_path, img_str, image

def predict(image):
    resized = preprocess_input(cv2.resize(np.array(image), (224, 224)).reshape(-1, 224, 224, 3))

    # Race
    race_dict = {0: 'Black', 1: 'East Asian', 2: 'Latino/Hispanic', 3: 'Indian', 4: 'Middle Eastern', 5: 'Southeast Asian', 6: 'White'}
    race_model = load_model('models/race_v6.hdf5')
    race = race_dict[np.argmax(race_model.predict(resized))]


    # Gender
    gender_dict = {0: "Female", 1: "Male"}
    gender_model = load_model('models/gender_v1.hdf5')
    gender = gender_dict[np.argmax(gender_model.predict(resized))]

    # Age
    age_dict = {0: "0-2", 1: "10-19", 2: "20-29", 3: "3-9", 4: "30-39", 5: "40-49", 6: "50-59", 7: "60-69", 8: "more than 70"}
    age_model = load_model('models/age_v1.hdf5')
    age = age_dict[np.argmax(age_model.predict(resized))]
    return race, gender, age

def encode_image(image):
    """
    Encodes image to be sent to client-side
    """
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode('ASCII')
    return img_str

# @app.route('/api/display/', methods=['GET'])
# def display_image(filename):
#     print('display_image filename: ' + filename, file=sys.stderr)
#     return redirect(url_for('static', filename='uploads/'+filename), code=301)
# def predict_age(gen_path)


if __name__ == "__main__":
    app.run(debug=True)