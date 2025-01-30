from cred import conn
from checks import hashingPw

def registertoDB(username : str, email : str, password : str):
    hashedPassword = hashingPw(password)
    cur = conn.cursor()
    cur.execute('INSERT INTO users (username,email,password,created_at,updated_at) VALUES (%s,%s,%s,NOW(),NOW())', (username,email,hashedPassword))
    conn.commit()
    cur.close()