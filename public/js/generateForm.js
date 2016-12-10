'use strict';

function initialize(formInitializationScript, originalGlassRunSelection) {
    // run initialize script (start form with previous selected values if passed in as argument)
    formInitializationScript(originalGlassRunSelection);

    // auto generate select control options
    (function prepareSelectControl(optionListArray) {
        optionListArray.forEach(function(optionList) {
            $('select#' + optionList.id).append('<option value="" selected></option>');
            optionList.optionList.forEach(function(option) {
                if (option.displayFlag === undefined || option.displayFlag === true) {
                    $('select#' + optionList.id).append('<option class="current" value="' + option.value + '">' + option.text + '</option>');
                }
            });
        });
    })(selectOptionListArray);

    // auto generate checkbox control options
    (function prepareCheckControl(optionListArray) {
        optionListArray.forEach(function(optionList) {
            optionList.optionList.forEach(function(option) {
                $('div#' + optionList.id).append('<input name="' + optionList.id + '" type="checkbox" value="' + option.value + '" />&nbsp;' + option.text + '&nbsp;');
            });
        });
    })(checkInputListArray);
}