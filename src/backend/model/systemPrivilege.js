const serverConfig = require('../module/serverConfig.js');

const list = [{
    erpID: '05060001',
    membershipList: [{
        systemID: 1,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessLevel: 'full', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: []
    }, {
        systemID: 6,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessLevel: 'full', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: []
    }, {
        systemID: 7,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessLevel: 'full', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: ['*']
    }]
}, {
    erpID: '95070003',
    membershipList: [{
        systemID: 7,
        role: 'purchasingStaff', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessLevel: 'none', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: []
    }]
}, {
    erpID: '09100001',
    membershipList: [{
        systemID: 7,
        role: 'furnaceStaff', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessLevel: 'partial', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: [
            `${serverConfig.serverUrl}/${serverConfig.systemReference}/validateToken`
        ]
    }]
}];

function checkRoutePriv(erpID, systemID, requestRoute) {
    let passedPrivCheck = false;
    let userPrivObj = list.filter(function(userPrivObj) {
        return userPrivObj.erpID === erpID; // get the user privilge object
    });
    if (userPrivObj.length > 0) { // privilage membership found
        let membership = userPrivObj[0].membershipList.filter(function(membership) {
            return membership.systemID === parseInt(systemID);
        });
        if (membership.length > 0) { // privilage routes found
            if (membership[0].accessLevel === 'full') { // if user has full access right
                passedPrivCheck = true;
            } else if (membership[0].accessLevel === 'none') { // if user has no access right
                passedPrivCheck = false;
            } else { // loop through the membership list to get a match
                membership[0].funcPrivList.forEach(function(privRoute) {
                    if (privRoute === requestRoute) {
                        passedPrivCheck = true; // matching privilege found
                    }
                });
            }
        } else {
            passedPrivCheck = false;
        }
    }
    return passedPrivCheck;
}

function getPrivObject(erpID, systemID) {
    let privObject = {
        role: null,
        accessLevel: null,
        funcPrivList: []
    };
    list.forEach(function(userPrivObj) {
        if (userPrivObj.erpID === erpID) {
            userPrivObj.membershipList.forEach(function(membership) {
                if (membership.systemID === parseInt(systemID)) {
                    privObject.role = membership.role;
                    privObject.accessLevel = membership.accessLevel;
                    privObject.funcPrivList = membership.funcPrivList.slice();
                }
            });
        }
    });
    return privObject;
}

module.exports = {
    checkRoutePriv: checkRoutePriv,
    getPrivObject: getPrivObject,
    list: list
};