from flask import Flask, render_template, request, redirect, flash, url_for, Response
import main
import urllib.request
from werkzeug.utils import secure_filename
from app import app
import os
import sys

@app.route('/api/')
def index():
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept"
    print(response.data, file=sys.stderr)
    return response


@app.route('/api/', methods=['POST'])
def submit_file():
    print(request.args, file=sys.stderr)
    return request
    # if 'file' not in request.files:
    #     flash('No file part')
    #     return redirect(request.url)
    # file = request.files['file']
    # if file.filename == '':
    #     flash('No image selected for uploading')
    #     return redirect(request.url)
    # if file:
    #     print("here", file=sys.stderr)
    #     filename = secure_filename(file.filename)
    #     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
	# 	#print('upload_image filename: ' + filename)
    #     #getPrediction(filename)
    #     label, acc = getPrediction(filename)
    #     # render_template('index.html', filename=filename)
    #     flash(label)
    #     flash(acc)
    #     flash(filename)
    #     flash('Image successfully uploaded and displayed')
    #     return render_template('index.html', filename=filename)
    # else:
    #     flash('Allowed image types are -> png, jpg, jpeg, gif')
    #     return redirect(request.url)

@app.route('/display/<filename>')
def display_image(filename):
	#print('display_image filename: ' + filename)
    print("inside display_image")
    #return redirect(url_for("static", filename=filename), code=301)

if __name__ == "__main__":
    app.run(debug=True)