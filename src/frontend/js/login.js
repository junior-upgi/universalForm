import { viewFileSourceUrl, loginUrl, serverUrl } from './config.js';
import { decode } from 'jsonwebtoken';

export function displayLoginForm() {
    $('body').empty().load(`${viewFileSourceUrl}/login.html`, function(response) {
        $.get(`${serverUrl()}/systemList`, function(systemList) {
            systemList.forEach(function(system) {
                if (!system.hide) {
                    $('select#systemID').append(`<option value="${system.id}">${system.cReference}</option>`);
                }
            });
            submitHandler();
        });
    });
}

function submitHandler() {
    $('form#loginForm').submit(function(event) {
        if ($(this)[0].checkValidity()) {
            event.preventDefault();
            $.ajax({
                url: loginUrl(),
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: {
                    loginID: $('input#loginID').val(),
                    password: $('input#password').val(),
                    systemID: $('select#systemID option:selected').val()
                },
                encode: true,
                dataType: 'json',
                success: function(response) {
                    $('div#statusMessage').empty().text(`驗證成功，五秒後將轉移至${$('select#systemID option:selected').text()}頁面`);
                    sessionStorage.token = response.token;
                    sessionStorage.loginID = decode(response.token, { complete: true }).payload.loginID;
                    sessionStorage.systemID = decode(response.token, { complete: true }).payload.systemID;
                    sessionStorage.role = decode(response.token, { complete: true }).payload.privilege.role;
                    sessionStorage.accessLevel = decode(response.token, { complete: true }).payload.privilege.accessLevel;
                    sessionStorage.funcPrivList = JSON.stringify(decode(response.token, { complete: true }).payload.privilege.funcPrivList);
                    setTimeout(function() {
                        window.location = response.redirectUrl;
                    }, 5000);
                },
                error: function(error) {
                    $('div#statusMessage').empty().text(`驗證失敗: ${error.responseJSON.errorMessage}`);
                }
            });
        }
    });
}
