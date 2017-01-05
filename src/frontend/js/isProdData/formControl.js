import {
    initialize
} from '../appControl.js';

import {
    serverUrl,
    isProdDataInsertUrl,
    isProdDataUpdateUrl,
    tbmknoInsertUrl,
    deletePhotoUrl
} from '../config.js';

import {
    getAllUrlParams
} from '../utility.js';

import uuid from 'uuid/v4';

module.exports = {
    changeFormState: changeFormState,
    formBodyHtmlSource: './view/isProdData/formBody.html'
};

function changeFormState(formState) {
    $('select#formState').val(formState);
    isProdDataFormControl($('select#formState').val());
}

function markFormAsUpdated() {
    if (($('select#formState').val() === '1') || ($('select#formState').val() === '3')) {
        changeFormState((parseInt($('select#formState').val()) + 1).toString());
    }
}

function monitorFormUpdate() {
    $('input:not([type="checkbox"]).dataField,select.dataField,textarea.dataField').off('change').change(function() {
        markFormAsUpdated();
    });
    $('input[type="checkbox"].dataField').off('change').change(function() {
        let targetCheckboxSet = $(this).attr('name'); // save current checkbox's name for access
        if ($('input[name="' + targetCheckboxSet + '"]:checked').length > 1) {
            alert('不得複選，項目將自動重置歸零');
            $('input[name="' + targetCheckboxSet + '"]').prop('checked', false);
        }
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
    $('select#glassRun').off('change').change(function() {
        let newSelection = $('select#glassRun option:selected');
        let newSelectionValue = $('select#glassRun').val();
        if (newSelection.val() === '') {
            initialize({});
            return;
        } else if (newSelection.data('existingIsProdDataRecord') === 1) {
            reinitializeWithData(newSelection, newSelectionValue);
        } else {
            reinitializeWithoutData(newSelection, newSelectionValue);
        }
    });
}

function reinitializeWithoutData(selectedOption, selectedValue) {
    // wrap initialize with promise
    let reinitialize = function() {
        let deferred = new $.Deferred();
        initialize({
            deferred: deferred
        });
        return deferred.promise();
    }
    // call initialize using promise to get execution sequenced correctly
    reinitialize()
        .done(function() {
            $('select#glassRun').val(selectedValue);
            changeFormState('1');
        })
        .fail(function(error) {
            alert('歷史資料頁面建立失敗: ' + error);
        });
}

function reinitializeWithData(selectedOption, selectedValue) {
    // make sure function is called under the condition that an existing record is being selected
    if (selectedOption.data('existingIsProdDataRecord') === 1) {
        $.ajax(`${serverUrl}/productionHistory/isProdDataForm/recordID/${selectedOption.data('id')}`)
            .done(function(data) {
                // wrap initialize with promise
                function initializeWithData() {
                    let deferred = new $.Deferred();
                    initialize({
                        deferred: deferred
                    });
                    return deferred.promise();
                }
                // call initialize using promise to get execution sequenced correctly
                initializeWithData()
                    .done(function() {
                        $('select#glassRun').val(selectedValue);
                        fillRecordData(data[0]);
                    })
                    .fail(function(error) {
                        alert('歷史資料頁面建立失敗: ' + error);
                    });
            })
            .fail(function(error) {
                alert('歷史資料資料讀取發生錯誤: ' + error);
            });
    } else {
        alert('發生錯誤：歷史資料標記狀態異常');
    }
}

function isProdDataFormControl(formState) {
    let currentGlassRunSelection = $('select#glassRun option:selected');
    switch (formState) {
        case '0':
            break;
        case '1':
            $('input#recordDate').val(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'));
            if (currentGlassRunSelection.val() === '') { // if not glassRun is selected
                $('input#machno').prop('readonly', true);
                $('input#glassProdLineID').prop('readonly', false).prop('required', true);
                $('input#prd_no').prop('readonly', true);
                $('input#mockProdReference').prop('readonly', false).prop('required', true);
                $('input#schedate').prop('readonly', false).prop('required', true);
                $('input#sampling').off('change').change(function() {
                    if ($(this).prop('checked') === true) {
                        $('input#allscheqty').val(0).prop('readonly', true).prop('required', false);
                    } else {
                        $('input#allscheqty').val('').prop('readonly', false).prop('required', true);
                    }
                });
                $('input#orderQty').val(currentGlassRunSelection.data('orderQty')).prop('readonly', false);
            } else { // a glassRun entry is seleted
                $('input#machno').val(currentGlassRunSelection.data('machno')).prop('readonly', true);
                $('input#glassProdLineID').val(currentGlassRunSelection.data('glassProdLineID')).prop('readonly', true).prop('required', true);
                $('input#prd_no').val(currentGlassRunSelection.data('prd_no')).prop('readonly', true);
                $('input#mockProdReference').val(currentGlassRunSelection.data('PRDT_SNM')).prop('readonly', true).prop('required', true);
                $('input#schedate').val(currentGlassRunSelection.data('schedate')).prop('readonly', true).prop('required', true);
                $('input#sampling').prop('checked', currentGlassRunSelection.data('sampling')).off('click').on('click', function(event) {
                    // 'readonly' property does not work on <input type="checkbox">
                    event.preventDefault();
                    return false;
                });
                $('input#orderQty').val(currentGlassRunSelection.data('orderQty')).prop('readonly', true);
            }
            $('input#submitRecord').val('新增記錄').prop('disabled', false).off('click').on('click', function(event) {
                event.preventDefault();
                alert('空白文件無可寫入內容');
            });
            $('button#deleteRecordButton').text('清除頁面').prop('disabled', false).off('click').on('click', function() {
                alert('空白文件不須清除');
            });
            $('button#printRecordButton').text('列印文件').prop('disabled', false).off('click').on('click', function() {
                alert('文件尚未儲存，無法列印');
            });
            monitorFormUpdate();
            break;
        case '2':
            $('input#submitRecord').val('新增記錄').prop('disabled', false).off('click').on('click', function(event) {
                if ($('form#' + getAllUrlParams().formReference + 'Form')[0].checkValidity()) {
                    event.preventDefault();
                    submitButtonHandler(formState);
                }
            });
            $('button#deleteRecordButton').text('清除頁面').prop('disabled', false).off('click').on('click', function() {
                deleteButtonHandler(formState);
            });
            $('button#printRecordButton').text('列印文件').prop('disabled', false).off('click').on('click', function() {
                alert('文件尚未儲存，無法列印');
            });
            break;
        case '3':
            $('input#machno').prop('readOnly', true);
            $('input#glassProdLineID').prop('readOnly', true);
            $('input#prd_no').prop('readOnly', true);
            $('input#mockProdReference').prop('readOnly', true);
            $('input#schedate').prop('readOnly', true);
            $('input#sampling').prop('checked', currentGlassRunSelection.data('sampling')).off('click').on('click', function(event) {
                // 'readonly' property does not work on <input type="checkbox">
                event.preventDefault();
                return false;
            });
            $('input#orderQty').prop('readOnly', true);
            $('input#submitRecord').val('儲存記錄').prop('disabled', false).off('click').on('click', function(event) {
                event.preventDefault();
                alert('歷史資料尚無變更，不須儲存');
            });
            $('button#deleteRecordButton').text('刪除記錄').prop('disabled', false).off('click').on('click', function() {
                deleteButtonHandler(formState);
            });
            $('button#printRecordButton').text('列印文件').prop('disabled', false).off('click').on('click', function() {
                printButtonHandler(formState);
            });
            monitorFormUpdate();
            break;
        case '4':
            $('input#submitRecord').val('修改記錄').prop('disabled', false).off('click').on('click', function(event) {
                if ($('form#' + getAllUrlParams().formReference + 'Form')[0].checkValidity()) {
                    event.preventDefault();
                    submitButtonHandler(formState);
                }
            });
            $('button#deleteRecordButton').text('取消修改').prop('disabled', false).off('click').on('click', function() {
                deleteButtonHandler(formState);
            });
            $('button#printRecordButton').text('列印文件').prop('disabled', false).off('click').on('click', function() {
                alert('文件尚未儲存，無法列印');
            });
            break;
        default:
            alert('[control.js] formController failure: state process procedures not found for ' + formState);
            break;
    }
}

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
                            .append(`<img class="${objectIndex}" src="${serverUrl + '/productionHistory/' + record[objectIndex]}" height="120" width="160" />`)
                            .append(`<button name="${objectIndex}" class="${objectIndex} photoDeleteButton hideWhenPrint" type="button">刪除</button>`);
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
    // start event monitor for photo delete button
    $('button.photoDeleteButton').off('click').on('click', function() {
        alert('圖片將即將刪除');
        let photoType = $(this).attr('name');
        $.get(deletePhotoUrl($('select#glassRun option:selected').data('id'), photoType), function(result) {
            if (!result.success) {
                alert(`圖片刪除發生錯誤，請與IT聯繫(${result.error})`);
                return false;
            }
            $('img.' + photoType).remove(); // remove the img element
            $('button.' + photoType).remove(); // remove the removal button
            $('input#' + photoType).show(); // show the original upload control
        });
    });
}

function deleteButtonHandler(formState) {
    switch (formState) {
        case '2':
            alert('記錄內容修改即將取消並重置');
            reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
            break;
        case '3':
            alert('即將刪除歷史資料');
            $.ajax({
                url: serverUrl + '/productionHistory/isProdDataForm/recordID/' + $('select#glassRun option:selected').data('id'),
                type: 'delete',
                success: function(response) {
                    alert('歷史資料刪除成功');
                    initialize({});
                },
                error: function(error) {
                    alert('歷史資料刪除失敗，請聯繫IT檢視');
                    console.log(error);
                }
            });
            break;
        case '4':
            alert('記錄內容修改即將取消並重置');
            reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
            break;
        default:
            alert(`此頁面狀態 formState: ${formState} 尚未配置頁面淨空程式`);
            break;
    }
}

function submitButtonHandler(formState) {
    let matchingGlassRunOption = checkTbmknoAvailability();
    let generatedUuid = uuid().toUpperCase();
    let schedate = $('input#schedate').val();
    let glassProdLineID = $('input#glassProdLineID').val();
    let mockProdReference = $('input#mockProdReference').val();
    let valueString = `${schedate} ${glassProdLineID} ${mockProdReference}`;
    let matchingOption = $('select#glassRun option').filter(function() {
        return $(this).val() === valueString;
    });
    switch (formState) {
        case '2':
            if ($('select#glassRun').val() === '') { // manual record entry without glassRun selection
                if (matchingOption.data('id') === null) {
                    // record exist in original ERP tbmkno only
                    // heading data comes from the erp production planning system (Z_DB_U105.dbo.tbmkno)
                    // generate a UUID and write to isProdData only
                    // reinitialize with the new record
                    $.ajax({
                        url: isProdDataInsertUrl + generatedUuid,
                        type: 'post',
                        data: new FormData($('form#isProdDataForm')[0]),
                        processData: false,
                        contentType: false
                    }).done(function(response) {
                        // change glassRun to the existing selection and make it existing, then reinitialize
                        alert('資料新增成功');
                        $('select#glassRun').val(response.value);
                        $('select#glassRun option:selected').data('existingIsProdDataRecord', 1);
                        reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
                    }).fail(function(error) {
                        alert('資料新增失敗，請聯繫IT檢視\ncase \'2\': if (matchingOption.data(\'id\') === null)');
                        console.log(error);
                    });
                } else {
                    // record exists in both orig erp tbmkno and productionHistory.dbo.productionHistory
                    // use the existing uuid and write to isProdData Only
                    // reinitialize with the new record
                    if (matchingOption.data('source') === 'generated') {
                        $.ajax({
                            url: isProdDataInsertUrl + matchingOption.data('id'),
                            type: 'post',
                            data: new FormData($('form#isProdDataForm')[0]),
                            processData: false,
                            contentType: false
                        }).done(function(response) {
                            // change glassRun to the existing selection and make it existing, then reinitialize
                            alert('資料新增成功');
                            $('select#glassRun').val(response.value);
                            $('select#glassRun option:selected').data('existingIsProdDataRecord', 1);
                            reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
                        }).fail(function(error) {
                            alert('資料新增失敗，請聯繫IT檢視\ncase \'2\': if (matchingOption.data(\'source\') === \'generated\')');
                            console.log(error);
                        });
                    } else {
                        alert('資料新增失敗，請聯繫IT檢視\ncase \'2\': unhandled portion after if (matchingOption.data(\'source\') === \'generated\')');
                    }
                }
            } else { // record entry with a glassRun selection selected
                console.log('record entry with a glassRun selection selected');
            }
            /*
            // check if the new data matches existing entry in the glassRun list
            if (matchingGlassRunOption.val() !== undefined) { // if match is found
                alert('a'); // ////////////////////////////////////////////////////////////////////
                // heading data comes from another form
                // use the id already presented and write to isProdData only
                // reinitialize with the new record
                if ((matchingGlassRunOption.data('existingIsProdDataRecord') === 0) &&
                    (matchingGlassRunOption.data('source') === 'generated')) {
                    $.ajax({
                        url: isProdDataInsertUrl + matchingGlassRunOption.data('id'),
                        type: 'post',
                        data: new FormData($('form#isProdDataForm')[0]),
                        processData: false,
                        contentType: false,
                        success: function(data, textStatus, jqXHR) {
                            // change glassRun to the existing selection and make it existing, then reinitialize
                            alert('a資料新增成功');
                            $('select#glassRun').val(data.value);
                            $('select#glassRun option:selected').data('existingIsProdDataRecord', 1);
                            reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            alert('資料新增失敗，請聯繫IT檢視(' + textStatus + '): ' + errorThrown);
                            console.log(textStatus + ': ' + errorThrown);
                        }
                    });
                } else if ((matchingGlassRunOption.data('existingIsProdDataRecord') === 0) &&
                    (matchingGlassRunOption.data('source') === 'tbmkno')) {
                    alert('b'); // /////////////////////////////////////////////////////////////////////////////
                    // heading data comes from the erp production planning system (Z_DB_U105.dbo.tbmkno)
                    // generate a UUID and write to both isProdData and productionHistory.dbo.tbmkno
                    // reinitialize with the new record
                    let tbmknoInsert = $.ajax({
                        url: tbmknoInsertUrl + generatedUuid,
                        type: 'post',
                        data: JSON.stringify({
                            sampling: $('input#sampling').prop('checked') ? 1 : 0,
                            machno: $('input#machno').val(),
                            glassProdLineID: $('input#glassProdLineID').val(),
                            schedate: $('input#schedate').val(),
                            prd_no: $('input#prd_no').val(),
                            orderQty: $('input#orderQty').val()
                        }),
                        contentType: 'application/json'
                    });
                    let isProdDataInsert = $.ajax({
                        url: isProdDataInsertUrl + generatedUuid,
                        type: 'post',
                        data: new FormData($('form#isProdDataForm')[0]),
                        processData: false,
                        contentType: false
                    });
                    $.when(tbmknoInsert, isProdDataInsert).done(function(response1, response2) {
                        // change glassRun to the existing selection and make it existing, then reinitialize
                        alert('b資料新增成功');
                        $('select#glassRun').val(response2[0].value);
                        $('select#glassRun option:selected').data('existingIsProdDataRecord', 1);
                        reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
                    }).fail(function(error) {
                        alert('資料新增失敗，請聯繫IT檢視');
                        console.log(error);
                    });
                } else if (matchingGlassRunOption.data('existingIsProdDataRecord') === 1) {
                    alert('c'); // /////////////////////////////////////////////////////////////////////////////
                    // heading data matches and an existing record is found
                    // do not write and reinitialize with the existing record
                    alert('c新輸入資料與歷史資料發現有重複狀況，頁面將轉至該筆歷史資料');
                    $('select#glassRun').val(matchingGlassRunOption.val());
                    let newSelection = $('select#glassRun option:selected');
                    let newSelectionValue = matchingGlassRunOption.val();
                    reinitializeWithData(newSelection, newSelectionValue);
                } else {
                    // something else is wrong, display error and initialize an empty page
                    alert('新資料建立前置作業失敗，發現異常資料狀態。頁面即將重置');
                    initialize({});
                    return false;
                }
            } else {
                alert('d'); // /////////////////////////////////////////////////////////////////////////////
                // no matches found either in ERP tbmkno or generated tbmkno
                // generate an UUID and write to both productionHistory.dbo.tbmkno and isProdData table
                // reinitialize to the new record
                let tbmknoInsert = $.ajax({
                    url: tbmknoInsertUrl + generatedUuid,
                    type: 'post',
                    data: JSON.stringify({
                        sampling: $('input#sampling').prop('checked') ? 1 : 0,
                        machno: $('input#machno').val(),
                        glassProdLineID: $('input#glassProdLineID').val(),
                        schedate: $('input#schedate').val(),
                        prd_no: $('input#prd_no').val(),
                        orderQty: $('input#orderQty').val()
                    }),
                    contentType: 'application/json'
                });
                let isProdDataInsert = $.ajax({
                    url: isProdDataInsertUrl + generatedUuid,
                    type: 'post',
                    data: new FormData($('form#isProdDataForm')[0]),
                    processData: false,
                    contentType: false
                });
                $.when(tbmknoInsert, isProdDataInsert).done(function(response1, response2) {
                    // make a temporary selection option on glassRun, then reinitialize
                    alert('d資料新增成功');
                    $('select#glassRun').append(`<option class="glassRun newRecord" value="${response2[0].value}">${response2[0].value}</option>`);
                    $('select#glassRun option.newRecord').data('id', response2[0].id).data('existingIsProdDataRecord', 1);
                    $('select#glassRun').val(response2[0].value);
                    reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
                }).fail(function(error) {
                    alert('資料新增失敗，請聯繫IT檢視');
                    console.log(error);
                });
            }
            */
            break;
        case '4':
            $.ajax({
                url: isProdDataUpdateUrl($('select#glassRun option:selected').data('id')),
                type: 'put',
                data: new FormData($('form#isProdDataForm')[0]),
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('資料更新成功');
                    reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
                },
                error: function(error) {
                    alert('資料更新失敗，請聯繫IT檢視');
                    console.log(error);
                }
            });
            break;
        default:
            alert(`此頁面狀態 formState: ${formState} 尚未配置記錄資料傳送程式`);
            break;
    }
}

function printButtonHandler(formState) {
    $('.hideWhenPrint').hide(); // hide elements that should not appear on the printed page
    // prepare elements for printing
    $('input.preparePrint').each(function() {
        $(this).after('<span class="removeAfterPrint">' + $(this).val() + '</span>');
        $(this).hide();
    });
    $('select.preparePrint').each(function() {
        if ($(this).val() === null) {
            $(this).after('<span class="removeAfterPrint"></span>');
        } else {
            $(this).after('<span class="removeAfterPrint">' + $(this).val() + '</span>');
        }
        $(this).hide();
    });
    $('div.bordered.heightControl').css('height', 28); // compress cells a bit
    let originalHeight = $('div.resizeToPrint').css('height');
    $('div.resizeToPrint').css('height', 160);
    print(); // print page
    reinitializeWithData($('select#glassRun option:selected'), $('select#glassRun').val());
}
