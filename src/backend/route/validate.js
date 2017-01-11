const express = require('express');

const tokenValidation = require('../middleware/tokenValidation.js');

const router = express.Router();

router.get('/validate', tokenValidation, function(request, response) {
    return response.status(200).json({
        error: null
    });
});

module.exports = router;
