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
    virtualenv --python=python3.4 env
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


