const express = require('express');

const utility = require('../../module/utility.js');
const tokenValidation = require('../../middleware/tokenValidation.js');

const router = express.Router();

router.put('/isProdDataForm/:photoType/:id', tokenValidation, function(request, response) {
    let id = request.params.id;
    let photoType = request.params.photoType;
    utility.executeQuery(`UPDATE productionHistory.dbo.isProdData SET ${photoType}=NULL WHERE id='${id}';`, function(queryResponse, error) {
        if (error) {
            utility.logger.error(`photo data reference removal failure: ${error}`);
            return response.status(500).json({
                id: id,
                photoType: photoType,
                success: false,
                error: error
            });
        }
        utility.fileRemoval(`image/isProdDataForm/${photoType}/${id}.JPG`, function() {
            utility.logger.info('photo deleted');
            return response.status(200).json({
                id: null,
                photoType: photoType,
                success: true,
                error: null
            });
        });
    });
});

module.exports = router;
