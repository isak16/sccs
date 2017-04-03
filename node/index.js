var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();
mongoose.connect("mongodb://localhost:27017/chat");
var db = mongoose.connection;
var users = db.collection("users");
var conversations = db.collection("conversations");

app.use(bodyParser.json());

/**************************************************
 * API:
 * 1. Users
 * 2. Conversations
 * 3. Miscellaneous (login, etc)
 **************************************************/

/**
 * GET object with quantity and users array properties
 * @type function
 * @return Object
 */
app.get("/users", function(request, response) {
    users.find().toArray(function(error, result) {
        if (error) {
            response.status(500).send(error);
            return;
        }
        response.send({
            quantity: result.length,
            users: result
        });
    })
});

/**
 * GET object with user related to a specific ID
 * @type function
 * @return Object
 */
app.get("/users/:id", function(request, response) {
    users.findOne({ _id: request.params.id }, function(error, result) {
        if (error) {
            response.status(500).send(error);
            return;
        }
        response.send(result);
    });
});

/**
 * POST an object to the users collection
 * @type function
 * @return true|false
 */
app.post("/users", function(request, response) {
    users.find({ email: request.body.email }, function(error, result) {
        if (error) {
            response.status(500).send(error);
            return false;
        } else if (result.length > 0) {
            users.insertOne(request.body, function(error, result) {
                if (error) {
                    response.status(500).send(error);
                    return false;
                } else if (result) {
                    response.send(request.body._id);
                }
            });
        }
    });
});

/**
 * PUT an object to replace user properties
 * @type function
 * @return Object|false
 */
app.put("/users/:id", function(request, response) {
    users.updateOne({
        { _id: request.params.id },
        {
            "display_name": request.body.display_name,
            "email": request.body.email,
            "password": request.body.password
        }
    }, function(error, result) {
        if (error) {
            response.status(500).send(error);
            return false;
        }
        response.send(request.body);
    });
});
