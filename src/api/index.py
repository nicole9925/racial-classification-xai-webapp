from flask import json, Flask, render_template, request, redirect, flash, url_for, Response
import main
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

UPLOAD_FOLDER = 'static/upload/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
GEN_FOLDER = 'static/generated_images'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    global name 
    name = secure_filename(request.form.get('filename'))
    filename = os.path.join(UPLOAD_FOLDER, name)

    image_data = bytes(request.form.get('file'), encoding="ascii")
    im = Image.open(BytesIO(base64.b64decode(image_data))).convert('RGB')
    im.save(filename)
    gen_path = preprocess(filename)

    # data = {"input_path": filename, "gen_path": gen_path}
    data = {"name": name}
    resp = app.response_class(
    status=200,
    response= json.dumps(data),
    mimetype='application/json'
        )
    return resp

def preprocess(file_path):
    gen_path = os.path.join(GEN_FOLDER, name)

    image, image_arr = detect_face(file_path)

    image.save(gen_path)
    
    return gen_path

@app.route('/<filename>', methods=['GET'])
def display_image(filename):
    print('display_image filename: ' + filename, file=sys.stderr)
    return redirect(url_for('static', filename='uploads/'+filename), code=301)
# def predict_age(gen_path)


if __name__ == "__main__":
    app.run(debug=True)