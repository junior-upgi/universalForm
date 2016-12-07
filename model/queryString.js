const getGlassRunRecordset = "SELECT * FROM productionHistory.dbo.glassRun ORDER BY schedate DESC,PRDT_SNM;";

module.exports = {
    getGlassRunRecordset
};