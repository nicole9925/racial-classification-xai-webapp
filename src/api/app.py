from flask import Flask
from flask_cors import CORS

UPLOAD_FOLDER = '.'

app = Flask(__name__)

CORS(app, supports_credentials=True)

app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024