# TV HACK

Dependencies
---

Needs `npm` and `git`. `bower` and `gulp` must be globally installed on npm.

Install
---
```
    git clone https://github.com/KairosHacks/website
    cd website
    npm install
    bower install
    gulp
    virtualenv --python=python3 env
    source env/bin/activate
    pip install -r requirements.txt
```

Run
---
```
    ./server.py
```        

Endpoints
---

## GET /api/isCaredBy/&lt;uid&gt;/
Returns the user objects taking care of a given user
```
{
    "users": [
        {
            "active": false,
            "caresFor": [
                "u1"
            ],
            "firstName": "Andrew",
            "inbound-notifications": {
                "data": {
                    "body": "You haven't called in 3 weeks, show some love!  ",
                    "title": "Dani is online <3 "
                }
            },
            "lastName": "Milson"
        },
        {
            "active": true,
            "caresFor": [
                "u1"
            ],
            "firstName": "Miquel",
            "lastName": "Llobet"
        }
    ]
}
```

## GET /api/stayOnline/&lt;uid&gt;/
Notifies the server that the user is still alive

## GET /api/user-tv/&lt;uid&gt;/
Gets the requested tv user object

## GET /api/user-carer/&lt;uid&gt;/
Gets the requested carer user object

## GET /api/call/&lt;uid&gt;/
Sets call flag for given uid

## GET /api/uncall/&lt;uid&gt;/
Unsets call for given uid

## GET /api/isCalling/&lt;uid&gt;/
Returns true if call is being made to uid
```
{
    "isCalling": true
}
```

## GET /api/remind/&lt;uid&gt;/
Reminds to call to a given user

## GET /api/notify/&lt;uid&gt;/
Notify the phone

## GET /api/notify/&lt;uid&gt;/
Stop notifying the phone
