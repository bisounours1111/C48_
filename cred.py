import psycopg2

conn = psycopg2.connect(
    host="yanisd.pro",
    dbname="postgres",
    user="postgres",
    password="example",
    port=5432
)