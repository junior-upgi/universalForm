var fs = require('fs');

module.exports = {
    uuidGenerator: function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },

    fileRemoval: function(completeFilePath) {
        fs.unlink(completeFilePath, function(error) {
            if (error !== null) {
                console.log('file removal failure (may not be critical failure): ' + error);
                return false;
            } else {
                console.log(completeFilePath + ' removed successfully');
                return true;
            }
        });
    }
}