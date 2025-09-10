from flask import Flask, render_template, request, session, redirect

app = Flask(__name__)

app.secret_key = "your_secret_key"

from flask_pymongo import PyMongo
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
mongo = PyMongo(app)

@app.route("/")
def home():
    message = "Successfully logged in!" if "user" in session else None
    return render_template("home.html", message=message)

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        mongo.db.users.insert_one({"username": username, "email": email, "password": password})

        return render_template("register.html", success="Registration Successful! Click here to ", link="/login")

    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = mongo.db.users.find_one({"email": email, "password": password})

        if user:
            session["user"] = email  
            return redirect("/")  
        else:
            return render_template("login.html", error="Invalid email or password!")

    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("user", None) 
    return redirect("/")  #

if __name__ == "__main__":
    app.run(debug=True)
