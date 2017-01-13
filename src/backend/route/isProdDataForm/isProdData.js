const express = require('express');
const fs = require('fs');
const moment = require('moment-timezone');

const imageDir = require('../../model/isProdDataForm/imageDir.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../module/utility.js');

const router = express.Router();

router.route('/isProdDataForm/isProdData/:id')
    .all(tokenValidation)
    .get(function(request, response, next) {
        if ((request.params.id === null) || (request.params.id === undefined) || (request.params.id === '')) {
            utility.logger.error('id not specified');
            return response.status(500).json([{}]);
        }
        let queryString = `SELECT a.*,b.orderQty,c.PRDT_SNM AS mockProdReference FROM productionHistory.dbo.isProdData a LEFT JOIN productionHistory.dbo.tbmkno b ON a.id=b.id LEFT JOIN productionHistory.dbo.isProdDataGlassRun c ON a.id=c.id WHERE a.id='${request.params.id}';`;
        utility.executeQuery(queryString, function(isProdDataRecordset, error) {
            if (error) {
                utility.logger.error(`database operation failure on isProdData/tbmkno lookup: ${error}`);
                return response.status(500).json([{}]);
            } else if (isProdDataRecordset.length === 0) {
                utility.logger.error(`record does not exist in isProdData/tbmkno lookup: ${error}`);
                return response.status(500).json([{}]);
            } else {
                for (let objectIndex in isProdDataRecordset[0]) {
                    if (isProdDataRecordset[0][objectIndex] === null) {
                        delete isProdDataRecordset[0][objectIndex]; // remove NULL fields
                    }
                    delete isProdDataRecordset[0]['created']; // remove timestamp field
                    delete isProdDataRecordset[0]['modified']; // remove timestamp field
                    if (isProdDataRecordset[0]['recordDate'] !== null) {
                        isProdDataRecordset[0]['recordDate'] = moment(isProdDataRecordset[0]['recordDate'], 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD');
                    }
                    if (isProdDataRecordset[0]['schedate'] !== null) {
                        isProdDataRecordset[0]['schedate'] = moment(isProdDataRecordset[0]['schedate'], 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD');
                    }
                }
                return response.status(200).json(isProdDataRecordset);
            }
        });
    })
    .post(imageDir.configuration.upload.any(), function(request, response, next) {
        let primaryKey = request.params.id;
        let uploadLocationObject = {};
        let newRecordSelectValue = `${request.body.schedate} ${request.body.glassProdLineID} ${request.body.mockProdReference}`;
        if (request.files.length === 0) {
            insertRecord(primaryKey, request.body, null);
        } else {
            request.files.forEach(function(file) {
                uploadLocationObject[file.fieldname] = file.destination + file.fieldname + '/' + primaryKey + '.JPG';
                fs.rename(file.path, uploadLocationObject[file.fieldname], function(error) {
                    if (error) {
                        utility.logger.error(`photo upload failure: ${error}`);
                        utility.alertSystemError('universalForm', `insert isProdData photo upload failure: ${error}`);
                        return response.status(500).send(`photo upload failure: ${error}`);
                    } else {
                        utility.logger.info('photo uploaded');
                    }
                });
            });
            insertRecord(primaryKey, request.body, uploadLocationObject);
        }

        function insertRecord(primaryKey, requestData, uploadLocationObject) {
            let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            let firstPart = 'INSERT INTO productionHistory.dbo.isProdData (';
            let fieldList = '';
            let thirdPart = ') VALUES (';
            let valueList = '';
            let endPart = ');';
            fieldList += 'id';
            valueList += '\'' + primaryKey + '\'';
            delete requestData.formState;
            delete requestData.glassRun;
            delete requestData.mockProdReference;
            delete requestData.orderQty;
            if (requestData.sampling === 'on' || requestData.sampling === '1' || requestData.sampling === 1) {
                requestData.sampling = 1;
            } else {
                requestData.sampling = 0;
            }
            for (let key in requestData) {
                if (requestData[key] !== '') {
                    fieldList += ',' + key;
                    valueList += ',\'' + requestData[key] + '\'';
                }
            }
            if (uploadLocationObject !== null) {
                if (uploadLocationObject.bmCoolingStack !== undefined) {
                    fieldList += ',bmCoolingStack';
                    valueList += ',\'' + uploadLocationObject.bmCoolingStack + '\'';
                }
                if (uploadLocationObject.fmCoolingStack !== undefined) {
                    fieldList += ',fmCoolingStack';
                    valueList += ',\'' + uploadLocationObject.fmCoolingStack + '\'';
                }
                if (uploadLocationObject.gobShape !== undefined) {
                    fieldList += ',gobShape';
                    valueList += ',\'' + uploadLocationObject.gobShape + '\'';
                }
            }
            fieldList += ',created,modified';
            valueList += ',\'' + currentDatetime + '\',\'' + currentDatetime + '\'';
            let queryString = firstPart + fieldList + thirdPart + valueList + endPart;
            utility.executeQuery(queryString, function(data, error) {
                if (error) {
                    utility.alertSystemError('universalForm', `insert isProdData record failure: ${error}`);
                    utility.logger.error(`insert isProdData record failure: ${error}`);
                    return response.status(500).send(`error inserting isProdData record: ${error}`);
                }
                utility.logger.info('isProdData insert completed...');
                return response.status(200).send({
                    value: newRecordSelectValue,
                    id: primaryKey
                });
            });
        }
    })
    .put(imageDir.configuration.upload.any(), function(request, response, next) {
        let primaryKey = request.params.id;
        let uploadLocationObject = {};
        let recordSelectValue = `${request.body.schedate} ${request.body.glassProdLineID} ${request.body.mockProdReference}`;
        if (request.files.length === 0) {
            updateRecord(primaryKey, request.body, null);
        } else {
            request.files.forEach(function(file) {
                uploadLocationObject[file.fieldname] = file.destination + file.fieldname + '/' + primaryKey + '.JPG';
                fs.rename(file.path, uploadLocationObject[file.fieldname], function(error) {
                    if (error) {
                        utility.logger.error(`photo upload failure: ${error}`);
                        utility.alertSystemError('universalForm', `insert isProdData photo upload failure: ${error}`);
                        return response.status(500).send(`photo upload failure: ${error}`);
                    } else {
                        utility.logger.info('photo uploaded');
                    }
                });
            });
            updateRecord(primaryKey, request.body, uploadLocationObject);
        }

        function updateRecord(primaryKey, requestData, uploadLocationObject) {
            let updateString = 'UPDATE productionHistory.dbo.isProdData ';
            let setString = 'SET ';
            let fieldList = [];
            let conditionString = 'WHERE id=\'' + primaryKey + '\';';
            delete requestData.glassRun;
            delete requestData.mockProdReference;
            delete requestData.orderQty;
            delete requestData.formState;
            for (let key in requestData) {
                if (requestData[key] !== '') {
                    fieldList += key + '=\'' + requestData[key] + '\',';
                } else {
                    fieldList += key + '=NULL,';
                }
            }
            if (uploadLocationObject !== null) {
                if (uploadLocationObject.bmCoolingStack !== undefined) {
                    fieldList += 'bmCoolingStack=\'' + uploadLocationObject.bmCoolingStack + '\',';
                }
                if (uploadLocationObject.fmCoolingStack !== undefined) {
                    fieldList += 'fmCoolingStack=\'' + uploadLocationObject.fmCoolingStack + '\',';
                }
                if (uploadLocationObject.gobShape !== undefined) {
                    fieldList += 'gobShape=\'' + uploadLocationObject.gobShape + '\',';
                }
            }
            fieldList += 'modified=\'' + moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + '\' ';
            let queryString = updateString + setString + fieldList + conditionString;
            utility.executeQuery(queryString, function(data, error) {
                if (error) {
                    utility.alertSystemError('universalForm', `update isProdData record failure: ${error}`);
                    utility.logger.error(`update isProdData record failure: ${error}`);
                    return response.status(500).send(`error updating isProdData record: ${error}`);
                }
                utility.logger.info('isProdData update completed...');
                return response.status(200).send({
                    value: recordSelectValue,
                    id: primaryKey
                });
            });
        }
    })
    .delete(function(request, response, next) {
        // delete from isProdData table
        utility.executeQuery(`DELETE FROM productionHistory.dbo.isProdData WHERE id='${request.params.id}';`, function(queryResponse, error) {
            if (error) {
                utility.logger.error(`error deleting isProdData record: ${error}`);
                return response.status(500).send(`error deleting isProdData record: ${error}`).end();
            }
            imageDir.configuration.pathList.forEach(function(path) {
                if (!utility.fileRemoval(`${path}/${request.params.id}.JPG`)) {
                    utility.logger.error('error removing photos.  attempting to continue...');
                }
            });
            // delete the record from tbmkno where id in the parameter is not found in 'productionHistory.dbo.productionHistory'
            utility.executeQuery(
                `DELETE a FROM productionHistory.dbo.tbmkno a LEFT JOIN productionHistory.dbo.productionHistory b ON a.id=b.id WHERE a.id='${request.params.id}' AND b.id IS NULL;`,
                function(queryResponse, error) {
                    if (error) {
                        utility.logger.error(`error deleting tbmkno record: ${error}`);
                        return response.status(500).send(`error deleting tbmkno record: ${error}`).end();
                    }
                    utility.logger.info('record delete successful...');
                    return response.status(200).send(true);
                });
        });
    });

module.exports = router;
