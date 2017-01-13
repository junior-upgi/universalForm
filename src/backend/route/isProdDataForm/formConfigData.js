const Promise = require('bluebird');
const express = require('express');

const tokenValidation = require('../../middleware/tokenValidation.js');

const formConfigData = require('../../model/isProdDataForm/formConfigData.js');

const utility = require('../../module/utility.js');

const router = express.Router();

// serve form control configuration data
router.get('/isProdDataForm/formConfigData', tokenValidation, function(request, response) {
    let formConfigDataList = [formConfigData.autoCompleteList(), formConfigData.checkboxList(), formConfigData.selectList()];
    Promise.all(formConfigDataList)
        .then(function(formConfigData) {
            return response.status(200).json(formConfigData);
        })
        .catch(function(error) {
            utility.logger.error(`error acquiring isProdDataForm formConfigData: ${error}`);
            return response.status(500).json([{}]);
        });
});

module.exports = router;
