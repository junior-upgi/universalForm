import { viewUrl } from './config.js';
import { displayLoginForm } from './login.js';
import { getAllUrlParams } from './utility.js';
import { initialize } from './appControl.js';

$('document').ready(function() {
    // check if login token existence
    if (sessionStorage.token === undefined) {
        displayLoginForm();
    } else {
        $('body').empty().load(`${viewUrl}/${getAllUrlParams().formReference}/formBody.html`, function() {
            initialize({});
        });
    }
});
