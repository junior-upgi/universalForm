import {
    initialize
} from '../appControl.js';

import {
    // serverUrl
} from '../config.js';

import {
    // getAllUrlParams
} from '../utility.js';

module.exports = {
    formBodyHtmlSource: './view/isProdData/FormBody.html',
    changeFormState: changeFormState
};

function changeFormState(formState) {
    console.log('changing form state to: ' + formState);
    $('select#formState').val(formState);
    isProdDataFormControl(formState);
}

function markFormAsUpdated() {
    console.log('marking form as updated');
    console.log('     original state: ' + $('select#formState').val());
    if (($('select#formState').val(formState) === '1') || ($('select#formState').val(formState) === '3')) {
        changeFormState((parseInt($('select#formState').val()) + 1));
    }
    console.log('     new state: ' + $('select#formState').val());
}

function monitorFormUpdate() {
    console.log('execute monitor form update');
    $('input.dataField,select.dataField,textarea.dataField').change(function() {
        markFormAsUpdated();
    });
    $('input.autocompleteDataField')
        .on('autocompletechange', function(event, ui) {
            event.preventDefault();
            if (ui.item !== null) {
                markFormAsUpdated();
            }
        })
        .on('autocompleteselect', function(event, ui) {
            event.preventDefault();
            if (ui.item !== null) {
                markFormAsUpdated();
            }
        });
    $('select#glassRun').change(function() {
        let newSelection = $('select#glassRun option:selected');
        if (newSelection.data('existingIsProdDataRecord') === 1) {
            initialize({
                value: newSelection.val(),
                id: newSelection.data('id'),
                machno: newSelection.data('machno'),
                glassProdLineID: newSelection.data('glassProdLineID'),
                schedate: newSelection.data('schedate'),
                prd_no: newSelection.data('prd_no'),
                mockProdReference: newSelection.data('PRDT_SNM'),
                orderQty: newSelection.data('orderQty'),
                source: newSelection.data('source'),
                existingIsProdDataRecord: newSelection.data('existingIsProdDataRecord')
            });
        } else {
            changeFormState(1);
            $('input#machno').val(newSelection.data('machno')).prop('readonly', true);
            $('input#prd_no').val(newSelection.data('prd_no')).prop('readonly', true);
            $('input#schedate').val(newSelection.data('schedate')).prop('readonly', true);
            $('input#glassProdLineID').val(newSelection.data('glassProdLineID')).prop('readonly', true);
            $('input#mockProdReference').val(newSelection.data('PRDT_SNM')).prop('readonly', true);
            $('input#sampling').prop('checked', newSelection.data('sampling')).on('click', function(event) {
                // 'readonly' property does not work on <input type="checkbox">
                event.preventDefault();
                return false;
            });
            $('input#orderQty').val(newSelection.data('orderQty')).prop('readonly', true);
        }
    });
}

/*
function loadIsProdDataRecord(recordIdObj) {
    $('select#glassRun').val(recordIdObj.value);
    if (recordIdObj.existingIsProdDataRecord === 1) {
        console.log('to do: load existing generated data');
        $.ajax(`/productionHistory/isProdDataForm/recordID/${recordIdObj.id}`)
            .done(function(data) {
                fillRecordData(data[0]);
            })
            .fail(function(error) {
                alert('[formControl.js/loadIsProdDataRecord] 資料讀取發生錯誤: ' + error);
            });
    } else {
        $('input#machno').val(recordIdObj.machno);
        $('input#prd_no').val(recordIdObj.prd_no);
        $('input#schedate').val(recordIdObj.schedate);
        $('input#glassProdLineID').val(recordIdObj.glassProdLineID);
        $('input#mockProdReference').val(recordIdObj.mockProdReference);
        $('input#orderQty').val(recordIdObj.orderQty);
    }
}*/

function isProdDataFormControl(formState) {
    switch (formState) {
        case 0:
            break;
        case 1:
            monitorFormUpdate();
            $('input#recordDate').val(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'));
            $('select#glassRun').prop('required', false);
            $('input#machno').prop('readonly', true);
            $('input#schedate').prop('required', true);
            $('input#prd_no').prop('readonly', true);
            $('input#submitNewRecord').prop('disabled', false);
            $('input#mockProdReference').prop('required', true);
            $('input#glassProdLineID').prop('required', true);
            $('input#sampling').change(function() {
                if ($(this).prop('checked') === true) {
                    $('input#allscheqty').val(0).prop('readonly', true).prop('required', false);
                } else {
                    $('input#allscheqty').val('').prop('readonly', false).prop('required', true);
                }
            });
            $('input#submitRecord').val('新增記錄').prop('disabled', false).on('click', function(event) {
                event.preventDefault();
                alert('空白文件無可寫入內容');
            });
            $('button#deleteRecordButton').text('清除頁面').prop('disabled', false).on('click', function() {
                alert('已是空白文件');
            });
            $('button#printRecordButton').text('列印文件').prop('disabled', false).on('click', function() {
                alert('文件尚未儲存，無法列印');
            });
            break;
            /*
            case 2:
                $('form#isProdDataForm').attr('action', './createManualRecord').attr('method', 'post');
                $('input#submitRecord').val('新增記錄').prop('disabled', false).on('click', function(event) {
                    if (!$('form#' + getAllUrlParams().formReference).checkValidity()) {
                        event.preventDefault();
                    }
                    submitButtonHandler(formState);
                });
                $('button#deleteRecordButton').text('清除頁面').prop('disabled', false).on('click', function() {
                    deleteButtonHandler(formState);
                });
                $('button#printRecordButton').text('列印文件').prop('disabled', false).on('click', function() {
                    alert('文件尚未儲存，無法列印');
                });
                break;
            case 3:
            monitorFormUpdate();
                $('input#machno').prop('readOnly', true);
                $('input#prd_no').prop('readOnly', true);
                $('input#schedate').prop('readOnly', true);
                $('input#glassProdLineID').prop('readOnly', true);
                $('input#mockProdReference').prop('readOnly', true);
                $('input#orderQty').prop('readOnly', true);
                $('input#submitRecord').val('儲存記錄').prop('disabled', false).on('click', function(event) {
                    event.preventDefault();
                    alert('仍為空白文件，不須儲存');
                });
                $('button#deleteRecordButton').text('刪除記錄').prop('disabled', false).on('click', function() {
                    deleteButtonHandler(formState);
                });
                $('button#printRecordButton').text('列印文件').prop('disabled', false).on('click', function() {
                    printButtonHandler(formState);
                });
                break;
            case 4:
            monitorFormUpdate();
                $('input#submitRecord').val('儲存記錄').prop('disabled', false).on('click', function(event) {
                    if (!$('form#' + getAllUrlParams().formReference).checkValidity()) {
                        event.preventDefault();
                    }
                    submitButtonHandler(formState);
                });
                $('button#deleteRecordButton').text('刪除記錄').prop('disabled', false).on('click', function() {
                    deleteButtonHandler(formState);
                });
                $('button#printRecordButton').text('列印文件').prop('disabled', false).on('click', function() {
                    alert('文件尚未儲存，無法列印');
                });
                break;
            case 5:
                // $('form#isProdDataForm').attr('action', './createManualRecord').attr('method', 'post');
                $('input#submitRecord').val('儲存記錄').prop('disabled', false).on('click', function(event) {
                    if (!$('form#' + getAllUrlParams().formReference).checkValidity()) {
                        event.preventDefault();
                    }
                    submitButtonHandler(formState);
                });
                $('button#deleteRecordButton').text('刪除記錄').prop('disabled', false).on('click', function() {
                    alert('仍為空白文件，無法刪除');
                });
                $('button#printRecordButton').text('列印文件').prop('disabled', false).on('click', function() {
                    alert('仍為空白文件，無法列印');
                });
                break;
            */
        default:
            alert('[control.js] formController failure: state process procedures not found for ' + formState);
            break;
    }
}

/*
function printButtonHandler(formState) {
    console.log('to do: print document');
}*/

/*
function fillRecordData(record) {
    for (let objectIndex in record) {
        if (objectIndex !== 'id') {
            switch ($('#' + objectIndex).get(0).tagName) {
                case 'INPUT':
                    if (($('input#' + objectIndex).attr('type') === 'text') ||
                        ($('input#' + objectIndex).attr('type') === 'number') ||
                        ($('input#' + objectIndex).attr('type') === 'date')) {
                        $('input#' + objectIndex).val(record[objectIndex]);
                        break;
                    }
                    if ($('input#' + objectIndex).attr('type') === 'file') {
                        // put existing photo on the form and add a delete button
                        $('div.imageHolder.' + objectIndex)
                            .append('<img class="' + objectIndex + '" src="' + serverUrl + '/productionHistory/' + record[objectIndex] + '" height="160" width="160" />')
                            .append('<button class="' + objectIndex + ' hideWhenPrint" type="button" onclick="deletePhoto(\'' + objectIndex + '\')">刪除</button>');
                        // hide the original upload control
                        $('input#' + objectIndex).hide();
                        break;
                    }
                    if ($('input#' + objectIndex).attr('type') === 'checkbox') {
                        if ((record[objectIndex] === true) || (record[objectIndex] === 1)) {
                            $('input#' + objectIndex).prop('checked', true);
                        }
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
                    if ($('div#' + objectIndex).hasClass('checkboxControlContainer')) {
                        $(`input:checkbox[name="${objectIndex}"][value=${record[objectIndex]}]`).prop('checked', true);
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
}*/

/*
function deleteButtonHandler(formState) {
    switch (formState) {
        case '2':
            alert('記錄內容即將重置');
            initialize({});
            break;
        case '3':
            alert('記錄內容即將重置');
            initialize({});
            break;
        default:
            alert(`此頁面狀態 formState: ${formState} 尚未配置頁面淨空程式`);
            break;
    }

    if (formState === '2') {
        alert('自行新增記錄內容即將重置');
        initialize();
    } else {
        alert(`此頁面狀態 formState: ${formState} 尚未配置程式`);
    }
    // below code should be commented and reexamined before use
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
}*/

/*
function submitButtonHandler(formState) {
    switch (formState) {
        case '2':
            $.ajax({
                url: $('form#isProdDataForm').attr('action'),
                type: $('form#isProdDataForm').attr('method'),
                data: new FormData($('form#isProdDataForm')[0]),
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('資料新增成功');
                    initialize(response);
                    return false;
                },
                error: function(error) {
                    alert('資料更新失敗，請聯繫IT檢視');
                    console.log(error);
                    return false;
                }
            });
            break;
        default:
            alert(`此頁面狀態 formState: ${formState} 尚未配置記錄資料傳送程式`);
            break;
    }
    // below code should be commented and reexamined before use
    function submitUpdatedRecord() {
        let updatedFormData = new FormData($('form#isProdDataForm')[0]);
        $.ajax({
            url: $('form#isProdDataForm').attr('action'),
            type: 'put',
            data: updatedFormData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert('資料更新成功');
                // window.location.href = response;
            },
            error: function(error) {
                alert('資料更新失敗，請聯繫IT檢視');
                console.log(error);
            }
        });
    }
}
*/

/*
let isProdDataFormInitialization = function(originalGlassRunValue) {
    prepareISProdDataForm(originalGlassRunValue);
    glassRunSelectHandler();
    deleteButtonHandler();
};

function prepareTaskListForm(originalGlassRunValue) {
    $.get('http://localhost:9005/taskList', {
        recordID: originalGlassRunValue
    }, function(taskListHTMLSource) {
        $('form#isProdDataForm').before(taskListHTMLSource);
    });
}

function prepareISProdDataForm(originalGlassRunValue) {
    // auto fill form input date
    $('input#recordDate').val(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'));
    $('input#machno').hide(); // hide field that user does not need to see
    $('input#schedate').hide(); // hide field that user does not need to see
    $('input#prd_no').hide(); // hide field that user does not need to see
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
            $('option.current').data('prd_no', record.prd_no).addClass(record.prd_no);
            $('option.current').data('mockProdReference', record.PRDT_SNM);
            $('option.current').removeClass('current'); // remove the temporary identification class attrib
        });
        // ajax for existing IS production data records
        $.get(serverUrl + '/isProdData/recordID/all', function(recordset) {
            // label glassRun options with appropriate class and value to ID existing records
            recordset.forEach(function(record) {
                $('option.glassRun.' + record.glassProdLineID + '.' +
                    moment(record.schedate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '.' +
                    record.prd_no).append('<span class="existingData">*</span>').addClass('existingData').val(record.id);
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
}

function glassRunSelectHandler() {
    $('select#glassRun').change(function() { // function to handel event of glassRun control change
        // check if a previous selection is made
        if ($('input#machno').val() === '') { // first selection since starting the application
            $('input#machno').val($('select#glassRun option:selected').data('machno'));
            $('input#schedate').val($('select#glassRun option:selected').data('schedate'));
            $('input#prd_no').val($('select#glassRun option:selected').data('prd_no'));
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
            let newGlassRunSelection = { // save the current selected value and data
                id: ($('select option:selected').val() === '') ? undefined : $('select option:selected').val(),
                machno: $('select option:selected').data('machno'),
                schedate: $('select option:selected').data('schedate'),
                prd_no: $('select option:selected').data('prd_no'),
                mockProdReference: $('select option:selected').data('mockProdReference'),
                glassProdLineID: $('select option:selected').data('glassProdLineID')
            };
            $('body').empty(); // remove the html page
            // ajax for a clean copy of the form
            $.get(serverUrl + '/isProdDataForm/reload', function(formHTML) {
                $('body').append(formHTML); // place a clean copy of the form back into the webpage
                // insert the original values back into the form
                $('input#machno').val(newGlassRunSelection.machno);
                $('input#schedate').val(newGlassRunSelection.schedate);
                $('input#prd_no').val(newGlassRunSelection.prd_no);
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
}

function checkISProdDataExistence() {
    if ($('select#glassRun option:selected').hasClass('existingData')) {
        return true;
    } else {
        return false;
    }
}

function loadExistingISProdData() {
    // load task list against the record id
    // prepareTaskListForm($('select#glassRun').val());
    // load data for the actual form
    $.get(serverUrl + '/isProdData/recordID/' + $('select#glassRun').val(), function(record) {
        let fieldsToRemove = ['id', 'machno', 'machno', 'schedate', 'prd_no',
            'glassProdLineID', 'recordDate', 'feeder', 'spout', 'created', 'modified'
        ];
        // deal with null values of checkboxes and convert true/false values in checkbox fields into 1's and 0's
        if (record['conveyorHeating'] === null) {
            fieldsToRemove.push('conveyorHeating'); // when null the render action is skipped
        } else {
            record['conveyorHeating'] = (record['conveyorHeating'] === true) ? 1 : 0;
        }
        if (record['crossBridgeHeating'] === null) {
            fieldsToRemove.push('crossBridgeHeating'); // when null the render action is skipped
        } else {
            record['crossBridgeHeating'] = (record['crossBridgeHeating'] === true) ? 1 : 0;
        }
        fieldsToRemove.forEach(function(fieldName) { // remove unneccessary field/property
            delete record[fieldName];
        });
        // loop through record and map data to the form fields
        for (let objectIndex in record) { // loop through the record object by index
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
                                .append('<img class="' + objectIndex + '" src="' + serverUrl + '/' + record[objectIndex] + '" height="160" width="160" />')
                                .append('<button class="' + objectIndex + ' hideWhenPrint" type="button" onclick="deletePhoto(\'' + objectIndex + '\')">刪除</button>');
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
}

function deletePhoto(recordIndex) {
    $.get(serverUrl + '/isProdDataForm/deletePhoto/recordID/' + $('select#glassRun').val() + '/fieldName/' + recordIndex, function() {
        $('img.' + recordIndex).remove(); // remove the img element
        $('button.' + recordIndex).remove(); // remove the removal button
        $('input#' + recordIndex).show(); // show the original upload control
        alert('圖片已刪除');
    });
}

function printForm() {
    $('.hideWhenPrint').hide(); // hide elements that should not appear on the printed page
    // prepare elements for printing
    $('input.prepareToPrint').each(function() {
        $(this).after('<span class="removeAfterPrint">' + $(this).val() + '</span>');
        $(this).hide();
    });
    $('select.prepareToPrint').each(function() {
        $(this).after('<span class="removeAfterPrint">' + $(this).val() + '</span>');
        $(this).hide();
    });
    $('div.bordered.heightControl').css('height', 28); // compress cells a bit
    print(); // print page
    $('div.bordered.heightControl').css('height', 30); // restore cell height
    $('span.removeAfterPrint').remove(); // remove items that were prepared for printing
    $('.hideWhenPrint').show(); // show elements that were hidden while printing
    $('.prepareToPrint').show(); // show elements that were hidden after prepared for print
}

module.exports = {
    prepareTaskListForm: prepareTaskListForm,
    deletePhoto: deletePhoto,
    submitUpdatedRecord: submitUpdatedRecord,
    printForm: printForm
};
*/
