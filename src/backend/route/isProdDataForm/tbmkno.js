const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment-timezone');

const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../module/utility.js');

const router = express.Router();
router.use(bodyParser.json()); // parse application/json

router.post('/isProdDataForm/tbmkno/:id', tokenValidation, function(request, response) {
    let requestData = request.body;
    let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (requestData.sampling === 'on' || requestData.sampling === '1' || requestData.sampling === 1) {
        requestData.sampling = 1;
    } else {
        requestData.sampling = 0;
    }
    let potentialFieldList = ['sampling', 'machno', 'glassProdLineID', 'schedate', 'prd_no', 'orderQty'];
    let fieldString = 'id';
    let valueString = `'${request.params.id}'`;
    potentialFieldList.forEach(function(potentialField) {
        if ((requestData[potentialField] !== undefined) && (requestData[potentialField] !== '')) {
            fieldString += ',' + potentialField;
            valueString += ',\'' + requestData[potentialField] + '\'';
        }
    });
    fieldString += ',created,modified';
    valueString += `,'${currentDatetime}','${currentDatetime}'`;
    let queryString = `INSERT INTO productionHistory.dbo.tbmkno (${fieldString}) VALUES(${valueString});`;
    utility.executeQuery(queryString, function(data, error) {
        if (error) {
            utility.alertSystemError('universalForm', `insert tbmkno record failure: ${error}`);
            utility.logger.error(`insert tbmkno record failure: ${error}`);
            return response.status(500).send(`error inserting tbmkno record: ${error}`);
        }
        return response.status(200).send('tbmkno insert success');
    });
});

module.exports = router;
