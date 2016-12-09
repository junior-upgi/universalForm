'use strict';

$('document').ready(function() {
    initialize(isProdDataFormInitialization, '');
});

function initialize(formInitializationScript, originalGlassRunValue) {
    formInitializationScript(originalGlassRunValue);
    (function prepareSelectControl(optionListArray) { // auto generate select control options
        optionListArray.forEach(function(optionList) {
            $('select#' + optionList.id).append('<option value="" selected></option>');
            optionList.optionList.forEach(function(option) {
                $('select#' + optionList.id).append('<option class="current" value="' + option.value + '">' + option.text + '</option>');
            });
        });
    })(selectOptionListArray);
    (function prepareCheckControl(optionListArray) { // auto generate checkbox control options
        optionListArray.forEach(function(optionList) {
            optionList.optionList.forEach(function(option) {
                $('div#' + optionList.id).append('<input name="' + optionList.id + '" type="checkbox" value="' + option.value + '" />&nbsp;' + option.text + '&nbsp;');
            });
        });
    })(checkInputListArray);
}