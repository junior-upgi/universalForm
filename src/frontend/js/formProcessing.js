export function configForm(formConfigDataset) { // form control setup
    formConfigDataset.forEach(function(formConfigData) { // loop through the option's contents
        switch (formConfigData.type) { // check current object's type and process accordingly
            case 'autoCompleteList': // <input type="text"> element with jqueryUI autocomplete addon processing
                formConfigData.data.forEach(function(autoCompleteData) {
                    let controlHandle = $(`input#${autoCompleteData.id}`);
                    if (autoCompleteData.mirrorTarget === null) { // if no mirror target is set
                        controlHandle.autocomplete({
                            source: autoCompleteData.optionList,
                            minLength: autoCompleteData.minLength
                        });
                    } else { // set up additional event listening to sync control's displayed data
                        let mirrorTargetHandle = $(`input#${autoCompleteData.mirrorTarget}`);
                        controlHandle.autocomplete({
                            source: autoCompleteData.optionList,
                            minLength: autoCompleteData.minLength,
                            change: function(event, ui) {
                                event.preventDefault();
                                if (ui.item === null) {
                                    controlHandle.val('');
                                    mirrorTargetHandle.val('');
                                } else {
                                    controlHandle.val(ui.item.label);
                                    mirrorTargetHandle.val(ui.item.value);
                                }
                            },
                            select: function(event, ui) {
                                event.preventDefault();
                                if (ui.item === null) {
                                    controlHandle.val('');
                                    mirrorTargetHandle.val('');
                                } else {
                                    controlHandle.val(ui.item.label);
                                    mirrorTargetHandle.val(ui.item.value);
                                }
                            },
                            focus: function(event, ui) {
                                event.preventDefault();
                                if (ui.item === null) {
                                    controlHandle.val('');
                                    mirrorTargetHandle.val('');
                                } else {
                                    controlHandle.val(ui.item.label);
                                    mirrorTargetHandle.val(ui.item.value);
                                }
                            }
                        });
                    }
                });
                break;
            case 'checkboxList': // <input type="checkbox"> element processing
                formConfigData.data.forEach(function(checkboxData) {
                    let container = $('div#' + checkboxData.id);
                    checkboxData.optionList.forEach(function(checkboxData) {
                        container.append(`<input name="${container.attr('id')}" type="checkbox" value="${checkboxData.value}" class="dataField current" tabindex="" />&nbsp;${checkboxData.text} &nbsp`);
                        if (checkboxData.default === true) {
                            $('input.current').prop('checked', true);
                        }
                        $('input.current').removeClass('current');
                    });
                    if (checkboxData.multiSelect === false) {
                        // monitor sets of checkbox's and make sure multiselection setting is enforced
                        $(`input[type="checkbox"][name="${checkboxData.id}"]`).off('change').change(function() {
                            if ($(`input[name="${checkboxData.id}"]:checked`).length > 1) {
                                alert('不得複選，項目將自動重置歸零');
                                $(`input[name="${checkboxData.id}"]`).prop('checked', false);
                            }
                        });
                    }
                });
                break;
            case 'selectList': // <select> element processing
                formConfigData.data.forEach(function(selectData) {
                    let selectElement = $(`select#${selectData.id}`);
                    let attribute = selectData.attribute;
                    let optionList = selectData.optionList;
                    selectElement.append('<option value="" selected></option>'); // always start with an empty option in the list
                    optionList.forEach(function(optionData) { // loop through the attached option list
                        // check if the option should be displayed or hidden
                        if (optionData.displayFlag === undefined || optionData.displayFlag === true) {
                            selectElement.append(`<option class="current" value="${optionData.value}">${optionData.text}</option>`);
                            if (attribute === true) { // if the record has an 'attribute' true property
                                // remove properties that's not needed
                                delete optionData.value;
                                delete optionData.text;
                                for (let objectIndex in optionData) { // loop through the rest of the properties
                                    // place into <option>'s data-XXX attrib's
                                    $('option.current').data(objectIndex, optionData[objectIndex]);
                                }
                            }
                            $('option.current').removeClass('current'); // remove current class after processing
                        }
                    });
                });
                break;
            default:
                alert(`found control element types without valid processing method (${formConfigData.type})`);
                break;
        }
    });
}
