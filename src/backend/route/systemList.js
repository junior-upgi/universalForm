const express = require('express');

const upgiSystem = require('../model/upgiSystem.js');

const router = express.Router();

router.get('/systemList', function(request, response) { // serve system accessibilty by this server
    return response.status(200).json(upgiSystem.list);
});

module.exports = router;
