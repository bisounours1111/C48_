from cred import conn
import checks
import tokens
import mail
import update
import random
import ast
import user_profile
from flask import Flask, render_template, request , redirect, make_response

app = Flask(__name__)

cur = conn.cursor()


@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        username = request.form['username']
        password = request.form['password']
        confirmed_pw = request.form['confirmed_password']
        error_message = None

        if checks.isUsernameTaken(username):
            error_message = "Le nom d'utilisateur est déjà pris"
        elif checks.isEmailTaken(email):
            error_message = "L'addresse mail est déjà enregistré"
        elif not checks.validEmail(email):
            error_message = "L'addresse mail n'est pas valide"
        elif not checks.validUsername(username):
            error_message = "Le nom d'utilisateur doit contenir entre 4 et 16 lettres"
        elif not checks.securePassword(password):
            error_message = "Le mot de passe doit contenir au minimum : 8 caractères, 1 majuscule, 1 minuscule, 1 caractère spécial"
        elif password != confirmed_pw:
            error_message = "Les mots de passe ne correspondent pas"

        if error_message:
            return render_template('register.html', message=error_message)
        
        update.registertoDB(username, email, password)
        return redirect('/login')
    
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        error_message = None
        
        if checks.canConnect(username, password):
            resp = make_response(redirect('/'))
            resp.set_cookie('username', username)
            return resp
        
        error_message = "Nom d'utilisateur ou mot de passe incorrect"
        return render_template('login.html', message=error_message)
    
    return render_template('login.html')
        


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    resp = make_response(redirect('/'))
    resp.delete_cookie('username')
    return resp

if __name__ == '__main__':
    app.run(debug=True)