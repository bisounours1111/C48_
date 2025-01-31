import string
import re
import bcrypt
from cred import conn

SPECIAL_CHARACTERS = "!@#$%^&*()-_+=}{[]|:;<>.,?/"

def securePassword(password: str) -> bool:
    return (
        8 <= len(password) <= 50
        and any(c.isupper() for c in password)
        and any(c.islower() for c in password)
        and any(c.isdigit() for c in password)
        and any(c in SPECIAL_CHARACTERS for c in password)
    )

def validUsername(username: str) -> bool:
    return 4 <= len(username) <= 16 and all(c.isalnum() or c == '_' for c in username)

def validEmail(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def hashingPw(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def isUsernameTaken(username: str) -> bool:
    with conn.cursor() as cur:
        cur.execute("SELECT 1 FROM users WHERE username = %s", (username,))
        return cur.fetchone() is not None

def isEmailTaken(email: str) -> bool:
    with conn.cursor() as cur:
        cur.execute("SELECT 1 FROM users WHERE email = %s", (email,))
        return cur.fetchone() is not None

def checklogin(username: str, password: str) -> bool:
    with conn.cursor() as cur:
        cur.execute('SELECT password FROM users WHERE username = %s', (username,))
        result = cur.fetchone()
    
    if result is None:
        return False

    return bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8'))

if __name__ == "__main__":
    print(hashingPw('test'))
