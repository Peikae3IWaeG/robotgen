"""This module is used for initializing Flask application"""

from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from api import api

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api.init_app(app)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
