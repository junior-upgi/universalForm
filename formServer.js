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
var utility = require("./module/utility.js")

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
    pathList: [
        "image/isProdDataForm/bmCoolingStack",
        "image/isProdDataForm/fmCoolingStack",
        "image/isProdDataForm/gobShape"
    ],
    upload: multer({ dest: "image/isProdDataForm" + "/" })
}];
if (fileStructureValidated !== true) {
    imageDirectoryList.forEach(function(imageDirectory) {
        imageDirectory.pathList.forEach(function(path) {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            app.use("/" + imageDirectory.id + "/" + path, express.static("./" + path)); // serve static image files
        });
        console.log("directory created for: " + imageDirectory.id);
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
    let primaryKey = utility.uuidGenerator();
    let uploadLocationObject = {};
    if (request.files.length === 0) {
        console.log("no file upload received...");
        return createRecord(primaryKey, request.body, null);
    } else {
        request.files.forEach(function(file, index) {
            uploadLocationObject[file.fieldname] = file.destination + file.fieldname + "/" + primaryKey + ".JPG";
            fs.rename(file.path, uploadLocationObject[file.fieldname], function(error) {
                if (error) {
                    console.log("photo upload failure: " + error);
                    return response.status(500).send("photo upload failure: " + error);
                } else {
                    console.log("photo uploaded");
                }
            });
        });
        return createRecord(primaryKey, request.body, uploadLocationObject);
    }

    function createRecord(primaryKeyString, requestData, uploadPathObject) {
        database.executeQuery(queryString.insertGlassRunRecord(
                primaryKeyString, requestData, uploadPathObject),
            function(error) {
                if (error) {
                    return response.status(500).send("發生錯誤: " + error).end();
                }
                console.log("isProdDataFrom insert completed...");
                return response.status(200).redirect("http://localhost:8080/isProdDataForm.html");
            });
    };
});

app.listen(config.serverPort, function(error) { // start backend server
    if (error) {
        console.log("error starting universal formServer: " + error);
    } else {
        console.log("universal formServer in operation... (" + config.serverUrl + ")");
    }
});