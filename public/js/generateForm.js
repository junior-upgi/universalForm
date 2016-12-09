'use strict';

$('document').ready(function() {
    // ajax for a clean copy of the form
    $.get(serverUrl + '/isProdDataForm/reload', function(formHTML) {
        $('body').append(formHTML); // place a clean copy of the form into the webpage
        initialize(isProdDataFormInitialization, ''); // initialize the webpage form
    });
});

function initialize(formInitializationScript, originalGlassRunValue) {
    // run initialize script (start form with previous selected values if passed in as argument)
    formInitializationScript(originalGlassRunValue);

    // auto generate select control options
    (function prepareSelectControl(optionListArray) {
        optionListArray.forEach(function(optionList) {
            $('select#' + optionList.id).append('<option value="" selected></option>');
            optionList.optionList.forEach(function(option) {
                $('select#' + optionList.id).append('<option class="current" value="' + option.value + '">' + option.text + '</option>');
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