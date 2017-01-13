import { initializeBlankForm } from '../appControl.js';
import { preventEnterSubmit } from '../disableEnterSubmit.js';
import { serverUrl } from '../config.js';
import { changeFormState } from './formControl';
import { configForm } from '../formProcessing';
import { getAllUrlParams } from '../utility.js';
import { restoreData } from './restoreData.js';

export function printButtonHandler(formState) {
    $('.hideWhenPrint').hide(); // hide elements that should not appear on the printed page
    $('input.preparePrint').each(function() { // prepare elements for printing
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
    // let originalHeight = $('div.resizeToPrint').css('height');
    $('div.resizeToPrint').css('height', 160);
    print(); // print page
    alert('列印完成');
    let selectionValue = $('select#glassRun').val();
    initializeBlankForm()
        .then(function(formConfigDataset) {
            configForm(formConfigDataset); // setup the form controls according to data received
            $('select#glassRun').val(selectionValue); // restore to the intended selection
            changeFormState('3'); // change state must be set first (breaks either formState monitor/multiselection check)
            let selectionHandle = $('select#glassRun option:selected'); // reinitialize selection handle
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
