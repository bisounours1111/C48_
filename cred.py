import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

IP = os.getenv("IP")
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")

conn = psycopg2.connect(
    host=IP,
    dbname="postgres",
    user=USER,
    password=PASSWORD,
    port=5432
)