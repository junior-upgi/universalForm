const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs');

const serverConfig = require('../module/serverConfig.js');
const systemPrivilege = require('../model/systemPrivilege.js');
const telegramUser = require('../model/telegramUser');
const upgiSystem = require('../model/upgiSystem');
const utility = require('../module/utility.js');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

router.post('/login', function(request, response) {
    utility.logger.info(`received login request from ${request.body.loginID}`);
    let ldapClient = ldap.createClient({ url: serverConfig.ldapServerUrl });
    ldapClient.bind(`uid=${request.body.loginID},ou=user,dc=upgi,dc=ddns,dc=net`, request.body.password, function(error) {
        if (error) {
            utility.logger.error(`LDAP validation failure: ${error.lde_message}`);
            return response.status(403).json({
                errorMessage: error.lde_message
            });
        }
        ldapClient.unbind(function(error) {
            if (error) {
                utility.logger.error(`LDAP server separation failure: ${error.lde_message}`);
                utility.sendMessage([telegramUser.getUserID('蔡佳佑')], [`LDAP server separation failure: ${error.lde_message}`]);
            }
            utility.logger.info(`${request.body.loginID} account info validated, checking access rights`);
            // continue to check if user has rights to access the website of the system selected
            let userPrivObject = systemPrivilege.list.filter(function(privObject) {
                return privObject.erpID === request.body.loginID;
            });
            if (userPrivObject.length !== 1) {
                utility.logger.info(`userPrivObject.length: ${userPrivObject.length}`);
                return response.status(403).json({
                    errorMessage: '此帳號沒有使用權限'
                });
            } else {
                let systemMembershipObject = userPrivObject[0].membershipList.filter(function(membershipObject) {
                    return membershipObject.systemID === parseInt(request.body.systemID);
                });
                if (systemMembershipObject.length !== 1) {
                    utility.logger.info(`systemMembershipObject.length: ${systemMembershipObject.length}`);
                    return response.status(403).json({
                        errorMessage: '此帳號沒有使用權限'
                    });
                }
                utility.logger.info(`${request.body.loginID} ${request.body.systemID} access privilege validated`);
                let payload = {
                    loginID: request.body.loginID,
                    systemID: request.body.systemID,
                    privilege: systemPrivilege.getPrivObject(request.body.loginID, request.body.systemID)
                };
                let token = jwt.sign(payload, serverConfig.passphrase, { expiresIn: systemMembershipObject[0].accessPeriod });
                utility.logger.info(`${request.body.loginID} login procedure completed`);
                return response.status(200).json({
                    token: token,
                    redirectUrl: function() {
                        return upgiSystem.list.filter(function(system) {
                            return system.id === parseInt(request.body.systemID);
                        })[0].frontendUrl;
                    }()
                });
            }
        });
    });
});

module.exports = router;
