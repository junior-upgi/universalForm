const express = require('express');
const moment = require('moment-timezone');

const serverConfig = require('../module/serverConfig.js');

const router = express.Router();

router.get('/status', function(request, response) {
    return response.status(200).json({
        hostname: serverConfig.serverHostname,
        system: serverConfig.systemReference,
        status: 'online',
        timestamp: moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    });
});

module.exports = router;
