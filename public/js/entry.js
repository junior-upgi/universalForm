'use strict';
var serverUrl = 'http://upgi.ddns.net:9004/productionHistory'; // production
//var serverUrl = 'http://localhost:9004/productionHistory'; // development

$('document').ready(function() {
    // ajax for a clean copy of the form
    $.get(serverUrl + '/isProdDataForm/reload', function(formHTML) {
        $('body').append(formHTML); // place a clean copy of the form into the webpage
        initialize(isProdDataFormInitialization, ''); // initialize the webpage form

        // monitor sets of checkbox's and make sure multiselection setting is enforced
        $('input').change(function() { // checks on every change to checkbox's
            var targetCheckboxSet = $(this).attr('name'); // save current checkbox's name for access
            checkInputListArray.forEach(function(checkInputList) { // loop through sets available
                // when the looped set is found and multiselection is false
                if ((checkInputList.id === targetCheckboxSet) && (checkInputList.multiSelect === false)) {
                    var checkItemCount = 0;
                    $('input[name="' + targetCheckboxSet + '"]').each(function() {
                        if ($(this).prop('checked') === true) {
                            checkItemCount += 1;
                            if (checkItemCount > 1) {
                                alert($('input[name="' + targetCheckboxSet + '"]').text() + '項目不得複選\n所有項目將取消');
                                $('input[name="' + targetCheckboxSet + '"]').prop('checked', false);
                            }
                        }
                    });
                }
            });
        });
    });
});