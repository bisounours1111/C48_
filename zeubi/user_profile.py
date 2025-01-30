from cred import conn

def get_user_id(username):
    cur = conn.cursor()
    cur.execute('SELECT user_ID FROM UsersDB.User_Creds WHERE username=%s', (username,))
    result = cur.fetchone()
    res = result['user_ID']
    cur.close()
    return res

def get_user_xp(user_id):
    cur = conn.cursor()
    cur.execute('SELECT XP FROM UsersDB.User_Progression WHERE user_ID=%s', (user_id,))
    result = cur.fetchone()
    cur.close()
    print(result['XP'])


print(get_user_id('alixouz'))
get_user_xp(3)