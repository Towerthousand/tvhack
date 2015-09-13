#!/usr/bin/env python3

from flask import Flask
from flask import jsonify
from flask import render_template
from flask.ext.cors import CORS

from firebase import firebase

app = Flask(__name__)
CORS(app)

firebase = firebase.FirebaseApplication('https://tvhack.firebaseio.com', None)

_calling = False


@app.route('/')
def render_index():
    """ Returns the DirectTV UI page """
    return render_template('index.html')


@app.route('/call')
def render_call():
    """ Returns the DirectTV UI page """
    return render_template('call.html')


@app.route('/message')
def render_message():
    """ Returns the message page """
    return render_template('message.html')


@app.route('/api/isCaredBy/<uid>/', methods=['GET'])
def usersCaredBy(uid):
    """ Returns the user objects taking care of a given user """
    users = firebase.get('/users-tv/' + uid + '/isCaredBy', None)
    users_info = []
    for user in users:
        users_info.append(firebase.get('/users-carer', user))

    return jsonify({'users': users_info})


@app.route('/api/user-tv/<uid>/', methods=['GET'])
def user_tv(uid):
    """ Returns the requested tv user object  """
    user = firebase.get('/users-tv', uid)
    return jsonify(user)


@app.route('/api/user-carer/<uid>/', methods=['GET'])
def user_carer(uid):
    """ Returns the requested carer user object """
    user = firebase.get('/users-carer', uid)
    return jsonify(user)


@app.route('/api/stayOnline/<uid>/', methods=['GET'])
def stay_alive(uid):
    """ Notifies the server that uid is still online """
    global _calling
    return 'OK'


@app.route('/api/call/<uid>/', methods=['GET'])
def call(uid):
    """ calls a given uid """
    global _calling
    _calling = True
    return 'OK'


@app.route('/api/uncall/<uid>/', methods=['GET'])
def uncall(uid):
    """ uncalls a given uid """
    global _calling
    _calling = False
    return 'OK'


@app.route('/api/isCalling/<uid>/', methods=['GET'])
def is_calling(uid):
    """ Returns true if uid is being called """
    return jsonify({"isCalling": _calling})


@app.route('/api/remind/<uid>/', methods=['GET'])
def remid(uid):
    return 'OK'

#@app.route('/api/notify/<id>/', methods=['GET'])
#def notify(id):
#    firebase.

if __name__ == "__main__":
    app.run(debug=True)
