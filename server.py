#!/usr/bin/env python3

from flask import Flask
from flask import jsonify
from flask import render_template

from firebase import firebase

app = Flask(__name__)

firebase = firebase.FirebaseApplication('https://tvhack.firebaseio.com', None)


@app.route('/')
def index():
    """ Returns the DirectTV UI page """
    return render_template('index.html')


@app.route('/api/isCaredBy/<uid>/', methods=['GET'])
def users(uid):
    users = firebase.get('/users-tv/' + uid + '/isCaredBy', None)
    users_info = []
    for user in users:
        users_info.append(firebase.get('/users-carer', user))

    return jsonify({'users': users_info})

if __name__ == "__main__":
    app.run(debug=True)
