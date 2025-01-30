from cred import conn
from checks import hashingPw

def registertoDB(username : str, email : str, password : str):
    hashedPassword = hashingPw(password)
    cur = conn.cursor()
    cur.execute('INSERT INTO users (username,email,password,created_at,updated_at) VALUES (%s,%s,%s,NOW(),NOW())', (username,email,hashedPassword))
    conn.commit()
    cur.close()

def updatePassword(email, password):
    cur = conn.cursor()
    hashedPassword = hashingPw(password)
    cur.execute('UPDATE users SET password=%s, updated_at=NOW() WHERE email=%s', (hashedPassword, email,))
    conn.commit()
    cur.close()
    
if __name__ == "__main__":
    updatePassword('test@gmail.com', 'tes000t')