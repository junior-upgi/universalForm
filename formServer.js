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

// at start up, make sure that the file structure to hold image exists and starts image server
var fileStructureValidated = false;
var imageDirectoryList = [{
    id: "isProdDataForm",
    path: "image/isProdDataForm",
    upload: multer({ dest: "image/isProdDataForm" + "/" })
}];
if (fileStructureValidated !== true) {
    imageDirectoryList.forEach(function(imageDirectory) {
        if (!fs.existsSync(imageDirectory.path)) {
            fs.mkdirSync(imageDirectory.path);
        }
        app.use("/" + imageDirectory.id + "/" + imageDirectory.path, express.static("./" + imageDirectory.path)); // serve static image files
    });
    fileStructureValidated = true;
}

app.get("/glassRun", function(request, response) {
    database.executeQuery(queryString.getGlassRunRecordset, function(glassRunRecordset, error) {
        if (error) {
            return response.status(500).json([]).end();
        }
        return response.status(200).json(glassRunRecordset);
    });
});

app.post("/glassRun", imageDirectoryList[0].upload.any(), function(request, response) {
    console.log(moment(moment(), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") + " received POST request on /glassRun");
    let uploadLocation = [];
    if (request.files.length === 0) {
        console.log("no file upload received...");
        createRecord();
    } else {
        request.files.forEach(function(file, index) {
            uploadLocation.push(file.destination + file.filename + ".JPG");
            fs.rename(file.path, uploadLocation[index], function(error) {
                if (error) {
                    console.log("photo upload failure: " + error);
                    return response.status(500).send("photo upload failure: " + error);
                } else {
                    console.log("photo uploaded");
                    createRecord();
                }
            });
        });
    }

    function createRecord() {
        console.log(request.body);
        return response.status(200).end();
    };
});

app.listen(config.serverPort, function(error) { // start backend server
    if (error) {
        console.log("error starting universal formServer: " + error);
    } else {
        console.log("universal formServer in operation... (" + config.serverUrl + ")");
    }
});