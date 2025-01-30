from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from models import db, User, Post, Comment, Like, Category

blog = Blueprint("blog", __name__)


# ✅ Page principale du blog
@blog.route("/blog")
def blog_home():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return render_template("blog/blog_home.html", posts=posts)

# ✅ Page d'un article
@blog.route("/blog/post/<int:post_id>")
def post_detail(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template("blog/post.html", post=post)

# ✅ Création d'un article (si connecté)
@blog.route("/blog/create", methods=["GET", "POST"])
def create_post():
    if "username" not in session:
        flash("Vous devez être connecté pour écrire un article.", "error")
        return redirect(url_for("login"))

    if request.method == "POST":
        title = request.form["title"]
        content = request.form["content"]
        category_id = request.form.get("category_id")

        new_post = Post(title=title, content=content, user_id=session["user_id"], category_id=category_id)
        db.session.add(new_post)
        db.session.commit()
        flash("Article publié avec succès !", "success")
        return redirect(url_for("blog.blog_home"))

    categories = Category.query.all()
    return render_template("blog/create_post.html", categories=categories)

# ✅ Ajout d'un commentaire
@blog.route("/blog/comment", methods=["POST"])
def add_comment():
    if "user_id" not in session:
        return jsonify({"status": "error", "message": "Vous devez être connecté pour commenter."})
    
    post_id = request.form["post_id"]
    content = request.form["content"]

    new_comment = Comment(content=content, user_id=session["user_id"], post_id=post_id)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"status": "success", "message": "Commentaire ajouté !"})

# ✅ Liker un article
@blog.route("/blog/like", methods=["POST"])
def like_post():
    if "user_id" not in session:
        return jsonify({"status": "error", "message": "Vous devez être connecté pour liker."})

    post_id = request.form["post_id"]
    existing_like = Like.query.filter_by(user_id=session["user_id"], post_id=post_id).first()

    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({"status": "success", "message": "Like retiré."})

    new_like = Like(user_id=session["user_id"], post_id=post_id)
    db.session.add(new_like)
    db.session.commit()
    return jsonify({"status": "success", "message": "Article liké !"})
