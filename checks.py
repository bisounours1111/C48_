import string
import re
import bcrypt
from cred import conn

alphabet_lowercase = list(string.ascii_lowercase)
alphabet_uppercase = list(string.ascii_uppercase)
figures = list(string.digits)
special_characters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', ':', ';', '<', '>', ',', '.', '?', '/']



def securePassword(password : str) :
    hasUppercase = False
    hasLowercase = False
    hasFigure = False
    hasSpecial = False

    if len(password) < 8 and len(password) > 50 :
        return False
    for letter in password:
        if letter in alphabet_lowercase :
            hasLowercase = True
        if letter in alphabet_uppercase :
            hasUppercase = True
        if letter in figures :
            hasFigure = True
        if letter in special_characters :
            hasSpecial = True
    if hasSpecial and hasFigure and hasLowercase and hasUppercase == True :
        return True
    else : 
        return False

def validUsername(username : str) :
    if len(username) < 4 or len(username) > 16:
        return False

    for letter in username:
        if letter in special_characters:
            return False
        
    return True

def validEmail(email : str) :
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def hashingPw(password: str) -> str:
    bytes_pw = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(bytes_pw, salt)
    return hashed_password.decode('utf-8') 

def isUsernameTaken(username : str) :
    cur = conn.cursor()
    cur.execute("SELECT username FROM users WHERE username = %s", (username,))
    return cur.fetchone() is not None

def isEmailTaken(email : str) :
    cur = conn.cursor()
    cur.execute("SELECT email FROM users WHERE email = %s", (email,))
    return cur.fetchone() is not None

def checklogin(username : str, password : str):
    cur = conn.cursor()
    cur.execute('SELECT password FROM users WHERE username =%s',(username,))
    result = cur.fetchone()
    if result is None :
        return False
    else :
        dbpassword = result[0]
        cur.close()
        inputPassword = password.encode('utf-8')
        dbpassword_bytes = bytes(dbpassword, 'utf-8')
        return bcrypt.checkpw(inputPassword,dbpassword_bytes)
    
if __name__ == "__main__":
    print(hashingPw('test'))