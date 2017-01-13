import uuid from 'uuid/v4';

import { initializeBlankForm } from '../appControl.js';
import { serverUrl } from '../config.js';
import { changeFormState } from './formControl.js';
import { configForm } from '../formProcessing.js';
import { restoreForm } from './restoreData.js';
import { getAllUrlParams, sendAdminMessage, errorHandler } from '../utility.js';

export function submitButtonHandler(formState) {
    let generatedUuid = uuid().toUpperCase();
    let id = $('select#glassRun option:selected').data('id');
    let selectionHandle = $('select#glassRun option:selected');
    let selectionValue = $('select#glassRun').val();
    let schedate = $('input#schedate').val();
    let glassProdLineID = $('input#glassProdLineID').val();
    let mockProdReference = $('input#mockProdReference').val();
    let valueComposite = `${schedate} ${glassProdLineID} ${mockProdReference}`;
    let matchingOption = $('select#glassRun option').filter(function() {
        return $(this).val() === valueComposite;
    });
    switch (formState) {
        case '2':
            if (selectionValue === '') { // manual record entry without glassRun selection
                if (matchingOption.length === 1) { // found matching glass run
                    let id = matchingOption.data('id');
                    let source = matchingOption.data('source');
                    let existingIsProdDataRecord = matchingOption.data('existingIsProdDataRecord');
                    if (existingIsProdDataRecord) { // if isProdData record already exist
                        if (confirm('生產資料已存在，請確認是否直接取回原始文件\n"取消" - 檢視表頭資料是否正確\n"確定" - 取消任何修改並取回原始文件') === true) {
                            initializeBlankForm()
                                .then(function(formConfigDataset) {
                                    configForm(formConfigDataset); // setup the form controls according to data received
                                    $('select#glassRun').val(valueComposite); // restore to the intended selection
                                    changeFormState('3'); // change state must be set first (breaks either formState monitor/multiselection check)
                                    selectionHandle = $('select#glassRun option:selected'); // reinitialize selection handle to the matching item
                                    restoreForm(id); // load existing record back into the form (overwrite changes)
                                }).catch(function(error) {
                                    errorHandler(`頁面刷新發生錯誤: ${error}\n返回系統登入頁面`, `${serverUrl}/index.html`);
                                });
                            break;
                        }
                        break;
                    } else { // if isProdData does not exist
                        if (source === 'tbmkno') { // header info matches Z_DB_U105.dbo.tbmkno source
                            if (confirm('請按確認寫入資料') === true) {
                                submitFormData('post', generatedUuid);
                            }
                            break;
                        } else { // header info is generated(created already by productionHistory APP and exists in productionHistory.dbo.tbmkno)
                            if (id === null) {
                                sendAdminMessage('universalForm 發現資料異常狀況');
                                sendAdminMessage(`source: ${source}\nid: ${id}\nissue: 發現 'source' 為 'generated' 但是沒有正確 'id' 的 'glassRun' 項目`);
                                errorHandler('發現資料異常，請將目前資料進行記錄並向IT反應', `${serverUrl}/index.html`);
                                break;
                            }
                            submitFormData('post', id);
                            break;
                        }
                    }
                } else if (matchingOption.length === 0) { // no matching glass run record were found
                    let tbmknoInsert = $.ajax({
                        url: `${serverUrl}/${getAllUrlParams().formReference}/tbmkno/${generatedUuid}`,
                        method: 'post',
                        headers: { 'x-access-token': sessionStorage.token },
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
                        url: `${serverUrl}/${getAllUrlParams().formReference}/isProdData/${generatedUuid}`,
                        method: 'post',
                        headers: { 'x-access-token': sessionStorage.token },
                        data: new FormData($('form#isProdDataForm')[0]),
                        processData: false,
                        contentType: false
                    });
                    $.when(tbmknoInsert, isProdDataInsert).done(function(response1, response2) {
                        alert('資料新增成功');
                        initializeBlankForm()
                            .then(function(formConfigDataset) {
                                configForm(formConfigDataset); // setup the form controls according to data received
                                $('select#glassRun').val(valueComposite); // restore to the intended selection
                                changeFormState('3'); // change state must be set first (breaks either formState monitor/multiselection check)
                                restoreForm(generatedUuid); // load new record content back into the form
                            }).catch(function(error) {
                                errorHandler(`頁面刷新發生錯誤: ${error}\n返回系統登入頁面`, `${serverUrl}/index.html`);
                            });
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        errorHandler(`資料新增失敗，請聯繫IT檢視(${textStatus}): ${errorThrown}`, `${serverUrl}/index.html`);
                    });
                    break;
                } else {
                    sendAdminMessage('universalForm 發現資料異常狀況');
                    sendAdminMessage(`valueComposite: ${valueComposite}\nissue: 發現一個以上相同的 glassRun 項目`);
                    errorHandler('發現資料異常，請將目前資料進行記錄並向IT反應', `${serverUrl}/index.html`);
                    break;
                }
            } else { // record entry with a glassRun selection selected
                if (selectionHandle.data('id') === null) { // selected option does not have a corresponding entry in productionHistory.dbo.tbmkno
                    if (selectionHandle.data('source') !== 'tbmkno') {
                        sendAdminMessage('universalForm 發現資料異常狀況');
                        sendAdminMessage(`id: ${selectionHandle.data('id')}\nsource: ${selectionHandle.data('source')}\nissue: 不具 ID 資料來源應為 Z_DB_U105.dbo.tbmkno`);
                        errorHandler('發現資料異常，請將目前資料進行記錄並向IT反應', `${serverUrl}/index.html`);
                        break;
                    }
                    submitFormData('post', generatedUuid);
                    break;
                } else { // selected option has a corresponding entry in productionHistory.dbo.tbmkno
                    if (selectionHandle.data('source') !== 'generated') {
                        sendAdminMessage('universalForm 發現資料異常狀況');
                        sendAdminMessage(`id: ${selectionHandle.data('id')}\nsource: ${selectionHandle.data('source')}\nissue: 具 ID 資料來源應為 'generated' (productionHistory.dbo.productionHistory/tbmkno)`);
                        errorHandler('發現資料異常，請將目前資料進行記錄並向IT反應', `${serverUrl}/index.html`);
                        break;
                    }
                    // let id = selectionHandle.data('id');
                    submitFormData('post', id);
                    break;
                }
            }
        case '4':
            submitFormData('put', id);
            break;
        default:
            alert(`此頁面狀態 formState: ${formState} 尚未配置記錄資料傳送程式`);
            break;
    }
}

function submitFormData(method, id) {
    $.ajax({
        url: `${serverUrl}/${getAllUrlParams().formReference}/isProdData/${id}`,
        method: method,
        headers: { 'x-access-token': sessionStorage.token },
        data: new FormData($('form#isProdDataForm')[0]),
        processData: false,
        contentType: false
    }).done(function(response) {
        alert('資料新增/更新成功');
        initializeBlankForm()
            .then(function(formConfigDataset) {
                configForm(formConfigDataset); // setup the form controls according to data received
                changeFormState('3'); // change state must be set first (breaks either formState monitor/multiselection check)
                $('select#glassRun').val(response.value); // restore glassRun selection to the inserted/modified record
                restoreForm(response.id); // load the inserted/modifed record content back into the form
            }).catch(function(error) {
                errorHandler(`頁面刷新發生錯誤: ${error}\n返回系統登入頁面`, `${serverUrl}/index.html`);
            });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        errorHandler(`資料新增/更新失敗，請聯繫IT檢視(${textStatus}): ${errorThrown}`, `${serverUrl}/index.html`);
    });
}
