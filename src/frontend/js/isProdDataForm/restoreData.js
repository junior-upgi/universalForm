import { serverUrl } from '../config.js';
import { preventEnterSubmit } from '../disableEnterSubmit.js';
import { getAllUrlParams, errorHandler } from '../utility.js';

export function restoreForm(id) {
    $.ajax({ // load new record content back into the form
        method: 'get',
        url: `${serverUrl}/${getAllUrlParams().formReference}/isProdData/${id}`,
        headers: { 'x-access-token': sessionStorage.token }
    }).done(function(recordset) {
        restoreData(recordset[0]);
        preventEnterSubmit();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        errorHandler(`頁面刷新發生錯誤: ${errorThrown}\n返回系統登入頁面`, `${serverUrl}/index.html`);
    });
}

export function restoreData(record) {
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
                            .append(`<img class="${objectIndex}" src="${serverUrl}/${record[objectIndex]}" height="120" width="160" />`)
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
                    sessionStorage.clear();
                    window.location.replace(`${serverUrl}/index.html`);
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
                        sessionStorage.clear();
                        window.location.replace(`${serverUrl}/index.html`);
                        break;
                    }
                default:
                    alert('資料查詢顯示發生錯誤，請與IT聯繫 (unknown control type: ' + objectIndex + ')');
                    sessionStorage.clear();
                    window.location.replace(`${serverUrl}/index.html`);
                    break;
            }
        }
    }
    // start event monitor for photo delete button
    $('button.photoDeleteButton').off('click').on('click', function() {
        if (confirm('請確認確實要將圖片刪除') === true) {
            let id = $('select#glassRun option:selected').data('id');
            let photoType = $(this).attr('name');
            $.ajax({
                url: `${serverUrl}/${getAllUrlParams().formReference}/${photoType}/${id}`,
                method: 'put',
                headers: { 'x-access-token': sessionStorage.token }
            }).done(function() {
                alert('圖片已刪除');
                $('img.' + photoType).remove(); // remove the img element
                $('button.' + photoType).remove(); // remove the removal button
                $('input#' + photoType).show(); // show the original upload control
            }).fail(function(error) {
                alert(`圖片刪除發生錯誤，請與IT聯繫(${error.statusText}: ${error.responseText})`);
                sessionStorage.clear();
                window.location.replace(`${serverUrl}/index.html`);
            });
        }
    });
}
