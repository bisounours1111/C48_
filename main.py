from cred import conn
import checks
import update
from flask import Flask, render_template, request , redirect, make_response, jsonify

app = Flask(__name__)

cur = conn.cursor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/get_login_template")
def get_login_template():
    return render_template("login_template.html")

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        username = request.form['username']
        password = request.form['password']
        confirmed_pw = request.form['confirm_password']
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
            return jsonify({"status": "error", "message": error_message})
        
        update.registertoDB(username, email, password)
        return jsonify({"status": "success", "message": "Vous êtes maintenant inscrit"})
    

@app.route('/login', methods=['POST'])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        error_message = None
        
        if checks.checklogin(username, password):
            resp = make_response(jsonify({"status": "success", "message": "Vous êtes maintenant connecté"}))
            resp.set_cookie('username', username)
            return resp
        
        error_message = "Nom d'utilisateur ou mot de passe incorrect"
        return jsonify({"status": "error", "message": error_message})
    
@app.route('/logout', methods=['GET', 'POST'])
def logout():
    resp = make_response(jsonify({"status": "success", "message": "Vous êtes maintenant déconnecté"}))
    resp.delete_cookie('username')
    return resp

if __name__ == '__main__':
    app.run(debug=True)