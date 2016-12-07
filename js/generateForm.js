"use strict";

import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import moment from "moment-timezone";
import numeral from "numeral/src/numeral.js";
import "../public/isProdDataForm.html";

$("document").ready(function() {
    $("input#recordDate").val(moment(moment(), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD"));
    initialize();
});

function initialize() {
    $.get("http://localhost:9004/glassRun", function(recordset) {
        //console.log(recordset);
        $("select#glassRun").append('<option value="" disabled selected></option>');
        recordset.forEach(function(record, index) {
            $("select#glassRun").append('<option class="current" value="' + index + '">' +
                record.schedate + ' -  ' +
                record.glassProdLineID + '[' +
                record.PRDT_SNM + '] ' +
                numeral(record.orderQty).format("0,0") + ' ' +
                '</option>');
            $("option.current").data("schedate", record.schedate);
            $("option.current").data("glassProdLineID", record.glassProdLineID);
            $("option.current").data("prodReference", record.PRDT_SNM);
            $("option.current").removeClass("current");
        });
    });
    $("select#glassRun").change(function() {
        $("input#prodReference").val($("select option:selected").data("prodReference"));
        $("input#glassProdLineID").val($("select option:selected").data("glassProdLineID"));
    });
    var selectOptionListArray = [{
        id: "bmHolder",
        optionList: [{
            value: 0,
            text: "NO.1 SG"
        }, {
            value: 1,
            text: "NO.2 SG"
        }, {
            value: 2,
            text: "NO.3 SG"
        }, {
            value: 3,
            text: "NO.1 DG"
        }, {
            value: 4,
            text: "NO.2 DG"
        }, {
            value: 5,
            text: "NO.3 DG"
        }]
    }, {
        id: "fmHolder",
        optionList: [{
            value: 0,
            text: "NO.1 SG"
        }, {
            value: 1,
            text: "NO.2 SG"
        }, {
            value: 2,
            text: "NO.3 SG"
        }, {
            value: 3,
            text: "NO.1 DG"
        }, {
            value: 4,
            text: "NO.2 DG"
        }, {
            value: 5,
            text: "NO.3 DG"
        }]
    }, {
        id: "nrArm",
        optionList: [{
            value: 0,
            text: '3" SG'
        }, {
            value: 1,
            text: '3" DG'
        }]
    }, {
        id: "fuArm",
        optionList: [{
            value: 0,
            text: '3-1/4" SG'
        }, {
            value: 1,
            text: '3-1/4" DG'
        }]
    }, {
        id: "thimble",
        optionList: [{
            value: 0,
            text: "45mm"
        }, {
            value: 1,
            text: "70mm"
        }]
    }, {
        id: "plPositioner",
        optionList: [{
            value: "B/B",
            text: "B/B"
        }, {
            value: "P/B",
            text: "P/B"
        }]
    }, {
        id: "scoop",
        optionList: [{
            value: 0,
            text: "NO.1 SG"
        }, {
            value: 1,
            text: "NO.2 SG"
        }, {
            value: 2,
            text: "NO.1 DG"
        }, {
            value: 3,
            text: "NO.2 DG"
        }, {
            value: 4,
            text: "NO.3 DG"
        }]
    }, {
        id: "trough",
        optionList: [{
            value: 0,
            text: "NO.1 SG"
        }, {
            value: 1,
            text: "NO.2 SG"
        }, {
            value: 2,
            text: "NO.1 DG"
        }, {
            value: 3,
            text: "NO.2 DG"
        }, {
            value: 4,
            text: "NO.3 DG"
        }]
    }, {
        id: "deflector",
        optionList: [{
            value: 0,
            text: "NO.1 SG"
        }, {
            value: 1,
            text: "NO.2 SG"
        }, {
            value: 2,
            text: "NO.1 DG"
        }, {
            value: 3,
            text: "NO.2 DG"
        }, {
            value: 4,
            text: "NO.3 DG"
        }]
    }, {
        id: "orificeRing",
        optionList: [{
            value: 1,
            text: "15.9mm DG"
        }, {
            value: 2,
            text: "17.5mm DG"
        }, {
            value: 3,
            text: "18.3mm DG"
        }, {
            value: 4,
            text: "19.1mm DG"
        }, {
            value: 5,
            text: "19.8mm DG"
        }, {
            value: 6,
            text: "24.5mm SG"
        }, {
            value: 7,
            text: "25.5mm SG"
        }, {
            value: 8,
            text: "27mm SG"
        }, {
            value: 9,
            text: "28.6mm SG"
        }, {
            value: 10,
            text: "30mm SG"
        }]
    }, {
        id: "shearCam",
        optionList: [{
            value: 0,
            text: "31°"
        }, {
            value: 1,
            text: "45°"
        }, {
            value: 2,
            text: "65°"
        }, {
            value: 3,
            text: "70°"
        }, {
            value: 4,
            text: "91°"
        }, {
            value: 5,
            text: "106°"
        }]
    }, {
        id: "shear",
        optionList: [{
            value: 0,
            text: "NO. 285"
        }, {
            value: 1,
            text: "NO. 375"
        }]
    }, {
        id: "plunger",
        optionList: [{
            value: 0,
            text: "NO. 285"
        }, {
            value: 1,
            text: "NO. 375"
        }]
    }, {
        id: "plungerCam",
        optionList: [{
            value: 0,
            text: "NO. 285"
        }, {
            value: 1,
            text: "NO. 375"
        }]
    }];
    (function prepareSelectControl(optionListArray) {
        optionListArray.forEach(function(optionList) {
            $("select#" + optionList.id).append('<option value="" disabled selected></option>');
            optionList.optionList.forEach(function(option) {
                $("select#" + optionList.id).append('<option class="current" value="' + option.value + '">' + option.text + '</option>');
            });
        });
    })(selectOptionListArray);
    var checkInputListArray = [{
        id: "conveyorHeating",
        optionList: [{
            value: 1,
            text: "有"
        }, {
            value: 0,
            text: "無"
        }]
    }, {
        id: "crossBridgeHeating",
        optionList: [{
            value: 1,
            text: "有"
        }, {
            value: 0,
            text: "無"
        }]
    }];
    (function prepareCheckControl(optionListArray) {
        optionListArray.forEach(function(optionList) {
            optionList.optionList.forEach(function(option) {
                $("div#" + optionList.id).append('<input name="' + optionList.id + '" type="checkbox" value="' + option.value + '" />&nbsp;' + option.text + '&nbsp;');
            });
        });
    })(checkInputListArray);
}