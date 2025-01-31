from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

actuality = Blueprint("actuality", __name__)
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

@actuality.route("/actuality/walks")
def walks():
    return render_template("actuality/main.html")

@actuality.route("/actuality/transports")
def transports():
    return render_template("actuality/second.html")

@actuality.route("/actuality")
def actuality_home():
    
    return render_template("actuality/index.html", google_maps_api_key=GOOGLE_MAPS_API_KEY)
