from secrets import token_urlsafe
from cred import conn
from datetime import datetime , timedelta


def generateToken():
    token = token_urlsafe(32)
    return token

def storeToken(token: str, email: str, table: str):
    cur = conn.cursor()
    if table == "reset_tokens":
        token_expiration = datetime.now() + timedelta(minutes=5)
        cur.execute('INSERT INTO UsersDB.reset_tokens (token, email, expiration) VALUES (%s, %s, %s)', (token, email, token_expiration))
    conn.commit()
    cur.close()

def validToken(token : str):
    cur = conn.cursor()
    cur.execute('SELECT expiration FROM UsersDB.reset_tokens where token=%s',(token,))
    result = cur.fetchone()
    if result == None :
        return False
    else:
        token_expiration = result["expiration"]
    if token_expiration < datetime.now() :
        print(token_expiration)
        print(datetime.now())
        return False
    else:
        return True
    
def findEmailbyToken(token : str, table: str):
    cur = conn.cursor()
    if table == "reset_tokens" :
         cur.execute('SELECT email FROM UsersDB.reset_tokens where token=%s',(token,))
    result = cur.fetchone()
    if result == None :
        return False
    else :
        email = result["email"]
        return email

