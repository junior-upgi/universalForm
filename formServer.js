"use strict";

var bodyParser = require("body-parser");
var cors = require("cors");
var express = require("express");
var fs = require("fs");
var morgan = require("morgan");
var moment = require("moment-timezone");
var multer = require("multer");

var config = require("./module/config.js");
var database = require("./module/database.js");
var queryString = require("./model/queryString.js");

var app = express();
app.set("view engine", "ejs");
app.use(cors()); // allow cross origin request
app.use(morgan("dev")); // log request and result to console
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json()); // parse application/json

app.use("/public/image", express.static("./public/image")); // serve favicon

app.get("/glassRun", function(request, response) {
    database.executeQuery(queryString.getGlassRunRecordset, function(glassRunRecordset, error) {
        if (error) {
            return response.status(500).json([]).end();
        }
        return response.status(200).json(glassRunRecordset);
    });
});

app.listen(config.serverPort, function(error) { // start backend server
    if (error) {
        console.log("error starting formServer: " + error);
    } else {
        console.log("universalForm server in operation... (" + config.serverUrl + ")");
    }
});