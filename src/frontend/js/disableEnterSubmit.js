// prevent form being submitted through user press of the 'enter' key
export function preventEnterSubmit() {
    // make sure that .off('keydown') isn't set, otherwise autocomplete cannot be operated by arrow keys
    $('input,select')
        // .off('keydown')
        .keydown(function(event) {
            if (event.keyCode === 13) {
                let inputs = $(this).parents('form').eq(0).find(':input');
                if (inputs[inputs.index(this) + 1] !== null) {
                    inputs[inputs.index(this) + 1].focus();
                }
                event.preventDefault();
                return false;
            }
        });
}
