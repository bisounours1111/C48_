from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import db
from dotenv import load_dotenv
import os

load_dotenv()

IP = os.getenv("IP")
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
SECRET_KEY = os.getenv("SECRET_KEY")

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{USER}:{PASSWORD}@{IP}/postgres"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key = SECRET_KEY

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app
