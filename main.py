from flask import Flask, render_template, session, request, redirect, make_response, jsonify
from database import create_app
from blogs import blog
import checks
import update

app = create_app()
app.register_blueprint(blog)  # Ajoute la partie blog

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/get_login_template")
def get_login_template():
    return render_template("login_template.html")

@app.route('/register', methods=['POST'])
def register():
    email = request.form.get('email')
    username = request.form.get('username')
    password = request.form.get('password')
    confirmed_pw = request.form.get('confirm_password')

    if checks.isUsernameTaken(username):
        return jsonify({"status": "error", "message": "Le nom d'utilisateur est déjà pris"})
    if checks.isEmailTaken(email):
        return jsonify({"status": "error", "message": "L'adresse mail est déjà enregistrée"})
    if not checks.validEmail(email):
        return jsonify({"status": "error", "message": "L'adresse mail n'est pas valide"})
    if not checks.validUsername(username):
        return jsonify({"status": "error", "message": "Le nom d'utilisateur doit contenir entre 4 et 16 lettres"})
    if not checks.securePassword(password):
        return jsonify({"status": "error", "message": "Le mot de passe doit contenir au minimum : 8 caractères, 1 majuscule, 1 minuscule, 1 caractère spécial"})
    if password != confirmed_pw:
        return jsonify({"status": "error", "message": "Les mots de passe ne correspondent pas"})

    update.registertoDB(username, email, password)
    return jsonify({"status": "success", "message": "Vous êtes maintenant inscrit"})

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if checks.checklogin(username, password):
        resp = make_response(jsonify({"status": "success", "message": "Vous êtes maintenant connecté"}))
        resp.set_cookie('username', username)
        id = update.getUserId(username)
        session['user_id'] = id
        return resp
    
    return jsonify({"status": "error", "message": "Nom d'utilisateur ou mot de passe incorrect"})

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    resp = make_response(redirect('/'))
    session.pop('username', None)
    resp.set_cookie('username', '', expires=0)
    return resp

if __name__ == '__main__':
    app.run(debug=True)
