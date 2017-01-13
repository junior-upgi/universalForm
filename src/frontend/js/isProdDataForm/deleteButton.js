import { initializeBlankForm } from '../appControl.js';
import { preventEnterSubmit } from '../disableEnterSubmit.js';
import { serverUrl } from '../config.js';
import { changeFormState } from './formControl';
import { configForm } from '../formProcessing';
import { getAllUrlParams } from '../utility.js';
import { restoreData } from './restoreData.js';

export function deleteButtonHandler(formState) {
    switch (formState) {
        case '2':
            if (confirm('請確認是否清除頁面，將遺失未儲存之變更') === true) {
                initializeBlankForm()
                    .then(function(formConfigDataset) {
                        configForm(formConfigDataset); // setup the form controls according to data received
                        changeFormState('1'); // change state must be set first (breaks either formState monitor/multiselection check)
                        preventEnterSubmit();
                    }).catch(function(error) {
                        alert(`頁面清除發生錯誤: ${error}\n返回系統登入頁面`);
                        sessionStorage.clear();
                        window.location.replace(`${serverUrl}/index.html`);
                    });
            }
            break;
        case '3':
            if (confirm('請確認歷史資料刪除') === true) {
                let selectionHandle = $('select#glassRun option:selected'); // initialize selection handle
                $.ajax({
                    url: `${serverUrl}/${getAllUrlParams().formReference}/isProdData/${selectionHandle.data('id')}`,
                    method: 'delete',
                    headers: { 'x-access-token': sessionStorage.token },
                    success: function(response) {
                        alert('歷史資料刪除成功');
                        initializeBlankForm()
                            .then(function(formConfigDataset) {
                                configForm(formConfigDataset); // setup the form controls according to data received
                                changeFormState('1'); // change state must be set first (breaks either formState monitor/multiselection check)
                                preventEnterSubmit();
                            }).catch(function(error) {
                                alert(`頁面重整發生錯誤: ${error}\n返回系統登入頁面`);
                                sessionStorage.clear();
                                window.location.replace(`${serverUrl}/index.html`);
                            });
                    },
                    error: function(error) {
                        alert('歷史資料刪除失敗，請聯繫IT檢視');
                        sessionStorage.clear();
                        window.location.replace(`${serverUrl}/index.html`);
                    }
                });
            }
            break;
        case '4':
            if (confirm('請確認是否取消修改，頁面將刷新重置') === true) {
                let selectionValue = $('select#glassRun').val();
                initializeBlankForm()
                    .then(function(formConfigDataset) {
                        configForm(formConfigDataset); // setup the form controls according to data received
                        $('select#glassRun').val(selectionValue); // restore to the intended selection
                        changeFormState('3'); // change state must be set first (breaks either formState monitor/multiselection check)
                        let selectionHandle = $('select#glassRun option:selected'); // initialize selection handle
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
            }
            break;
        default:
            alert(`此頁面狀態 formState: ${formState} 尚未配置頁面淨空程式`);
            break;
    }
}
