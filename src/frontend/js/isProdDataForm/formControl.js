import moment from 'moment-timezone';

import { getAllUrlParams } from '../utility.js';
import { initializeBlankForm } from '../appControl.js';
import { serverUrl } from '../config.js';
import { configForm } from '../formProcessing.js';
import { preventEnterSubmit } from '../disableEnterSubmit.js';
import { deleteButtonHandler } from './deleteButton.js';
import { printButtonHandler } from './printButton.js';
import { submitButtonHandler } from './submitButton.js';
import { restoreData } from './restoreData.js';

export function changeFormState(formState) {
    $('select#formState').val(formState);
    isProdDataFormControl($('select#formState').val());
}

function isProdDataFormControl(formState) {
    let currentGlassRunSelection = $('select#glassRun option:selected');
    switch (formState) {
        case '0':
            break;
        case '1':
            $('input#recordDate').val(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'));
            if (currentGlassRunSelection.val() === '') { // if no glassRun is selected
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
                if ($(`form#${getAllUrlParams().formReference}`)[0].checkValidity()) {
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
                if ($(`form#${getAllUrlParams().formReference}`)[0].checkValidity()) {
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
            alert(`[control.js] formController failure: state process procedures not found for ${formState}`);
            break;
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
    $('select#glassRun')
        .on('focus', function() {
            sessionStorage.priorGlassRunValue = $('select#glassRun').val();
        }).off('change').change(function() {
            if (confirm('請確認是否更換製令單號選項，將移失未儲存之變更') === true) {
                let selectionHandle = $('select#glassRun option:selected');
                let selectionValue = $('select#glassRun').val();
                if ((selectionValue === '') || (selectionHandle.data('existingIsProdDataRecord') !== 1)) {
                    initializeBlankForm()
                        .then(function(formConfigDataset) {
                            configForm(formConfigDataset); // setup the form controls according to data received
                            $('select#glassRun').val(selectionValue); // restore to the intended selection
                            changeFormState('1'); // change state must be set first (breaks either formState monitor/multiselection check)
                            preventEnterSubmit();
                        }).catch(function(error) {
                            alert(`頁面刷新發生錯誤: ${error}\n返回系統登入頁面`);
                            sessionStorage.clear();
                            window.location.replace(`${serverUrl}/index.html`);
                        });
                } else if (selectionHandle.data('existingIsProdDataRecord') === 1) {
                    initializeBlankForm()
                        .then(function(formConfigDataset) {
                            configForm(formConfigDataset); // setup the form controls according to data received
                            $('select#glassRun').val(selectionValue); // restore to the intended selection
                            changeFormState('3'); // change state must be set first (breaks either formState monitor/multiselection check)
                            selectionHandle = $('select#glassRun option:selected'); // reinitialize selection handle
                            $.ajax({
                                method: 'get',
                                url: `${serverUrl}/${getAllUrlParams().formReference}/isProdData/${selectionHandle.data('id')}`,
                                headers: { 'x-access-token': sessionStorage.token }
                            }).done(function(recordset) {
                                restoreData(recordset[0]);
                                preventEnterSubmit();
                            }).fail(function(jqXHR, textStatus, errorThrown) {
                                alert(`頁面刷新發生錯誤: ${errorThrown}\n返回系統登入頁面`);
                                sessionStorage.clear();
                                window.location.replace(`${serverUrl}/index.html`);
                            });
                        }).catch(function(error) {
                            alert(`頁面刷新發生錯誤: ${error}\n返回系統登入頁面`);
                            sessionStorage.clear();
                            window.location.replace(`${serverUrl}/index.html`);
                        });
                } else {
                    alert('發生錯誤: 現有資料發現異常狀態\n返回系統登入頁面');
                    sessionStorage.clear();
                    window.location.replace(`${serverUrl}/index.html`);
                }
            } else {
                $('select#glassRun').val(sessionStorage.priorGlassRunValue);
            }
        });
}

function markFormAsUpdated() {
    if (($('select#formState').val() === '1') || ($('select#formState').val() === '3')) {
        changeFormState((parseInt($('select#formState').val()) + 1).toString());
    }
}
