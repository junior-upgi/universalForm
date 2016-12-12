'use strict';
var serverUrl = 'http://upgi.ddns.net:9004/productionHistory'; // production
//var serverUrl = 'http://localhost:9004/productionHistory'; // development

$('document').ready(function() {
    // ajax for a clean copy of the form
    $.get(serverUrl + '/isProdDataForm/reload', function(formHTML) {
        $('body').append(formHTML); // place a clean copy of the form into the webpage
        initialize(isProdDataFormInitialization, ''); // initialize the webpage form
    });
});