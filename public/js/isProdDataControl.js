'use strict';

var isProdDataFormInitialization = function(originalGlassRunValue) {
    prepareISProdDataForm(originalGlassRunValue);
    glassRunSelectHandler();
    deleteButtonHandler();
};

function deleteButtonHandler() {
    $('button#deleteRecordButton').click(function() {
        $.ajax({
            url: serverUrl + '/isProdData',
            type: 'delete',
            data: {
                recordID: $('select#glassRun option:selected').val()
            },
            success: function(response) {
                alert('資料刪除成功');
                window.location.href = response;
            },
            error: function(error) {
                alert('資料刪除失敗，請聯繫IT檢視');
                console.log(error);
            }
        });
    });
};

function prepareISProdDataForm(originalGlassRunValue) {
    // auto fill form input date
    $('input#recordDate').val(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'));
    $('input#machno').hide(); // hide field that user does not need to see
    $('input#schedate').hide(); // hide field that user does not need to see
    $('input#prodReference').hide(); // hide field that user does not need to see
    // ajax ERP extension's database for glass run record
    $.get(serverUrl + '/glassRun', function(recordset) {
        // fill in the select control so user can choose production run
        $('select#glassRun').append('<option value="" disabled selected></option>');
        recordset.forEach(function(record, index) { // loop through production run record
            // create option from the record data
            $('select#glassRun').append('<option class="glassRun current" value="' +
                moment(record.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD') + ' ' +
                record.glassProdLineID + '[' + record.PRDT_SNM + ']">' +
                moment(record.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD') + ' -  ' +
                record.glassProdLineID + '[' + record.PRDT_SNM + '] ' +
                numeral(record.orderQty).format('0,0') + ' ' + '</option>');
            // add 'data' and 'class' attributes to each options
            $('option.current').data('schedate',
                moment(record.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD')).addClass(
                moment(record.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD'));
            $('option.current').data('machno', record.machno).addClass(record.machno);
            $('option.current').data('glassProdLineID', record.glassProdLineID).addClass(record.glassProdLineID);
            $('option.current').data('prodReference', record.prd_no).addClass(record.prd_no);
            $('option.current').data('mockProdReference', record.PRDT_SNM);
            $('option.current').removeClass('current'); // remove the temporary identification class attrib
        });
        // ajax for existing IS production data records
        $.get(serverUrl + '/isProdData/recordID/all', function(recordset) {
            // label glassRun options with appropriate class and value to ID existing records
            recordset.forEach(function(record) {
                $('option.glassRun.' + record.glassProdLineID + '.' +
                    moment(record.schedate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '.' +
                    record.prodReference).append('<span class="existingData">*</span>').addClass('existingData').val(record.id);
            });
            // place the original selection back into the control
            if (originalGlassRunValue !== '') { // must execute at this position of the callback
                $('select#glassRun').val(originalGlassRunValue);
            }
            if (checkISProdDataExistence()) { // if selected glassRun has existing data
                loadExistingISProdData();
            }
        });
    });
};

function glassRunSelectHandler() {
    $('select#glassRun').change(function() { // function to handel event of glassRun control change
        // check if a previous selection is made
        if ($('input#machno').val() === '') { // first selection since starting the application
            $('input#machno').val($('select#glassRun option:selected').data('machno'));
            $('input#schedate').val($('select#glassRun option:selected').data('schedate'));
            $('input#prodReference').val($('select#glassRun option:selected').data('prodReference'));
            $('input#mockProdReference').val($('select#glassRun option:selected').data('mockProdReference'));
            $('input#glassProdLineID').val($('select#glassRun option:selected').data('glassProdLineID'));
            if (checkISProdDataExistence()) { // if selected glassRun has existing isProdData
                loadExistingISProdData();
            } else { // if no existing isProdData
                // set form up for record insert by POST
                $('form#isProdDataForm').attr('action', serverUrl + '/isProdData').attr('method', 'post');
                // disable the delete button since the page is setup for insert at this point of the code
                $('button#deleteRecordButton').prop('disabled', true);
                $('input#submitNewRecord').prop('disabled', false);
            }
        } else { // already exists a previous selection
            var newGlassRunSelection = { // save the current selected value and data
                id: ($('select option:selected').val() === '') ? undefined : $('select option:selected').val(),
                machno: $('select option:selected').data('machno'),
                schedate: $('select option:selected').data('schedate'),
                prodReference: $('select option:selected').data('prodReference'),
                mockProdReference: $('select option:selected').data('mockProdReference'),
                glassProdLineID: $('select option:selected').data('glassProdLineID')
            };
            $('form#isProdDataForm').remove(); // remove the form
            // ajax for a clean copy of the form
            $.get(serverUrl + '/isProdDataForm/reload', function(formHTML) {
                $('body').append(formHTML); // place a clean copy of the form back into the webpage
                // insert the original values back into the form
                $('input#machno').val(newGlassRunSelection.machno);
                $('input#schedate').val(newGlassRunSelection.schedate);
                $('input#prodReference').val(newGlassRunSelection.prodReference);
                $('input#mockProdReference').val(newGlassRunSelection.mockProdReference);
                $('input#glassProdLineID').val(newGlassRunSelection.glassProdLineID);
                // reinitialize the form controls
                initialize(isProdDataFormInitialization, newGlassRunSelection.id);
                // set form up for record insert by POST
                $('form#isProdDataForm').attr('action', serverUrl + '/isProdData').attr('method', 'post');
                // disable the delete button since the page is setup for insert at this point of the code
                $('button#deleteRecordButton').prop('disabled', true);
                $('input#submitNewRecord').prop('disabled', false);
            });
        }
    });
};

function checkISProdDataExistence() {
    if ($('select#glassRun option:selected').hasClass('existingData')) {
        return true;
    } else {
        return false;
    }
};

function loadExistingISProdData() {
    $.get(serverUrl + '/isProdData/recordID/' + $('select#glassRun').val(), function(record) {
        var fieldsToRemove = ['id', 'machno', 'machno', 'schedate', 'prodReference',
            'glassProdLineID', 'recordDate', 'feeder', 'spout', 'created', 'modified'
        ];
        fieldsToRemove.forEach(function(fieldName) { // remove unneccessary field/property
            delete record[fieldName];
        });
        // convert true/false values in checkbox fields into 1's and 0's
        record['conveyorHeating'] = (record['conveyorHeating'] === true) ? 1 : 0;
        record['crossBridgeHeating'] = (record['crossBridgeHeating'] === true) ? 1 : 0;
        // loop through record and map data to the form fields
        for (var objectIndex in record) { // loop through the record object by index
            if (record[objectIndex] !== null) { // only process the fields that isn't 'null'
                switch ($('#' + objectIndex).get(0).tagName) {
                    case 'INPUT':
                        if ($('input#' + objectIndex).attr('type') === 'text') {
                            $('input#' + objectIndex).val(record[objectIndex]);
                            break;
                        }
                        if ($('input#' + objectIndex).attr('type') === 'number') {
                            $('input#' + objectIndex).val(record[objectIndex]);
                            break;
                        }
                        if ($('input#' + objectIndex).attr('type') === 'file') {
                            // put existing photo on the form and add a delete button
                            $('div.imageHolder.' + objectIndex)
                                .append('<img class="' + objectIndex + '" src="' + serverUrl + '/' + record[objectIndex] + '" height="200" width="200" />')
                                .append('<button class=' + objectIndex + ' type="button" onclick="deletePhoto(\'' + objectIndex + '\')">刪除</button>');
                            // hide the original upload control
                            $('input#' + objectIndex).hide();
                            break;
                        }
                        alert('資料查詢顯示發生錯誤，請與IT聯繫 (input type not checked: ' + objectIndex + ')');
                        break;
                    case 'SELECT':
                        $('select#' + objectIndex).val(record[objectIndex]);
                        break;
                    case 'TEXTAREA':
                        $('textarea#' + objectIndex).val(record[objectIndex]);
                        break;
                    case 'DIV':
                        if ($('div#' + objectIndex).hasClass('checkboxControlHolder')) {
                            $('input:checkbox[name="' + objectIndex + '"][value=' + record[objectIndex] + ']').prop('checked', true);
                            break;
                        } else {
                            alert('資料查詢顯示發生錯誤，請與IT聯繫 (unknown control in DIV: ' + objectIndex + ')');
                            break;
                        }
                    default:
                        alert('資料查詢顯示發生錯誤，請與IT聯繫 (unknown control type: ' + objectIndex + ')');
                        break;
                }
            }
        }
        $('button#deleteRecordButton').prop('disabled', false); // enable deleteRecordButton
        // set form data action and method to enable a PUT request
        $('form#isProdDataForm').attr('action', serverUrl + '/isProdData').attr('method', 'put');
        $('input[type="submit"]').hide();
        $('div.formProcessButtonHolder').prepend('<button id="updateRecordButton" type="button" onclick="submitUpdatedRecord()">更新記錄</button>');
    });
};

function deletePhoto(recordIndex) {
    $.get(serverUrl + '/isProdDataForm/deletePhoto/recordID/' + $('select#glassRun').val() + '/fieldName/' + recordIndex, function() {
        $('img.' + recordIndex).remove(); // remove the img element
        $('button.' + recordIndex).remove(); // remove the removal button
        $('input#' + recordIndex).show(); // show the original upload control
        alert("圖片已刪除");
    });
};

function submitUpdatedRecord() {
    var updatedFormData = new FormData($('form#isProdDataForm')[0]);
    console.log(updatedFormData);
    $.ajax({
        url: $('form#isProdDataForm').attr('action'),
        type: 'put',
        data: updatedFormData,
        processData: false,
        contentType: false,
        success: function(response) {
            alert('資料更新成功');
            //window.location.href = response;
        },
        error: function(error) {
            alert('資料更新失敗，請聯繫IT檢視');
            console.log(error);
        }
    });
}