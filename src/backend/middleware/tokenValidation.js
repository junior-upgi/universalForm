const jwt = require('jsonwebtoken');

const serverConfig = require('../module/serverConfig.js');
const utility = require('../module/utility.js');

const systemPrivilege = require('../model/systemPrivilege.js');

// middleware func declaration for token validation
module.exports = function(request, response, next) {
    // get the full request route
    let requestRoute = `${request.protocol}://${request.get('Host')}${request.originalUrl}`;
    utility.logger.info(`conducting token validation on ${requestRoute}`);
    // check request for token
    let accessToken =
        (request.body && request.body.accessToken) ||
        (request.query && request.query.accessToken) ||
        request.headers['x-access-token'];
    if (accessToken) { // if a token is found
        jwt.verify(accessToken, serverConfig.passphrase, function(error, decodedToken) {
            if (error) {
                utility.logger.error(`token validation failure: ${error}`);
                return response.status(403).json({
                    error: error.message
                });
            }
            utility.logger.info('token is valid, checking access privilege');
            let loginID = decodedToken.loginID;
            let systemID = decodedToken.systemID;
            if (systemPrivilege.checkRoutePriv(loginID, systemID, requestRoute)) {
                next();
            } else {
                utility.logger.error(`user does not have access privilege to ${requestRoute}`);
                return response.status(403).json({
                    error: `user does not have access privilege to ${requestRoute}`
                });
            }
        });
    } else { // if there is no token, return an error
        utility.logger.error('token does not exist');
        return response.status(403).json({
            error: 'token does not exist'
        });
    }
};
