var isProdDataFormInitialization = function(originalGlassRunValue) {
    prepareISProdDataForm(originalGlassRunValue);
    glassRunSelectHandler();
};

function prepareISProdDataForm(originalGlassRunValue) {
    // auto fill form input date
    $('input#recordDate').val(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'));
    //$('input#machno').hide(); // hide field that user does not need to see
    //$('input#schedate').hide(); // hide field that user does not need to see
    //$('input#prodReference').hide(); // hide field that user does not need to see
    // ajax ERP extension's database for glass run record
    $.get('http://upgi.ddns.net:9004/productionHistory/glassRun', function(recordset) {
        // fill in the select control so user can choose production run
        $('select#glassRun').append('<option value="" disabled selected></option>');
        recordset.forEach(function(record, index) { // loop through production run record
            // create option from the record data
            $('select#glassRun').append('<option class="glassRun current" value="' +
                moment(record.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD') + ' ' +
                record.glassProdLineID + '[' + record.PRDT_SNM + ']">' +
                moment(record.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD') + ' -  ' +
                record.glassProdLineID + '[' + record.PRDT_SNM + '] ' +
                numeral(record.orderQty).format('0,0') + ' ' + '</option>');
            // add 'data' and 'class' attributes to each options
            $('option.current').data('schedate',
                moment(record.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD')).addClass(
                moment(record.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD'));
            $('option.current').data('machno', record.machno).addClass(record.machno);
            $('option.current').data('glassProdLineID', record.glassProdLineID).addClass(record.glassProdLineID);
            $('option.current').data('prodReference', record.prd_no).addClass(record.prd_no);
            $('option.current').data('mockProdReference', record.PRDT_SNM);
            $('option.current').removeClass('current'); // remove the temporary identification class attrib
        });
        // ajax for existing IS production data records
        $.get('http://upgi.ddns.net:9004/productionHistory/isProdData/recordID/all', function(recordset) {
            // label glassRun options with appropriate class and value to ID existing records
            recordset.forEach(function(record) {
                $('option.glassRun.' + record.glassProdLineID + '.' +
                    moment(record.schedate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '.' +
                    record.prodReference).append('<span class="existingData">*</span>').addClass('existingData').val(record.id);
            });
            // place the original selection back into the control
            if (originalGlassRunValue !== '') { // must execute at this position of the callback
                $('select#glassRun').val(originalGlassRunValue);
            }
            if (checkRecordExistence()) { // if selected glassRun has existing data
                loadExistingISProdData();
            }
        });
    });
};

function glassRunSelectHandler() {
    $('select#glassRun').change(function() { // function to handel event of glassRun control change
        // check if a previous selection is made
        if ($('input#machno').val() === '') { // first selection
            $('input#machno').val($('select#glassRun option:selected').data('machno'));
            $('input#schedate').val($('select#glassRun option:selected').data('schedate'));
            $('input#prodReference').val($('select#glassRun option:selected').data('prodReference'));
            $('input#mockProdReference').val($('select#glassRun option:selected').data('mockProdReference'));
            $('input#glassProdLineID').val($('select#glassRun option:selected').data('glassProdLineID'));
            if (checkRecordExistence()) { // if selected glassRun has existing isProdData
                loadExistingISProdData();
            } else { // if no existing isProdData
                $('form#isProdDataForm').attr('action', 'http://upgi.ddns.net:9004/productionHistory/isProdData').attr('method', 'post');
            }
        } else { // already exists a previous selection
            var newGlassRunSelection = { // save the current selected value and data
                id: ($('select option:selected').val() === '') ? undefined : $('select option:selected').val(),
                machno: $('select option:selected').data('machno'),
                schedate: $('select option:selected').data('schedate'),
                prodReference: $('select option:selected').data('prodReference'),
                mockProdReference: $('select option:selected').data('mockProdReference'),
                glassProdLineID: $('select option:selected').data('glassProdLineID')
            };
            $('form#isProdDataForm').remove(); // remove the form
            // ajax for a clean copy of the form
            $.get('http://upgi.ddns.net:9004/productionHistory/isProdDataForm/reload', function(formHTML) {
                $('body').append(formHTML); // place a clean copy of the form back into the webpage
                // insert the original values back into the form
                $('input#machno').val(newGlassRunSelection.machno);
                $('input#schedate').val(newGlassRunSelection.schedate);
                $('input#prodReference').val(newGlassRunSelection.prodReference);
                $('input#mockProdReference').val(newGlassRunSelection.mockProdReference);
                $('input#glassProdLineID').val(newGlassRunSelection.glassProdLineID);
                // reinitialize the form controls
                initialize(isProdDataFormInitialization, newGlassRunSelection.id);
            });
        }
    });
};

function checkRecordExistence() {
    if ($('select#glassRun option:selected').hasClass('existingData')) {
        return true;
    } else {
        return false;
    }
};

function loadExistingISProdData() {
    $.get('http://upgi.ddns.net:9004/productionHistory/isProdData/recordID/' + $('select#glassRun').val(), function(record) {
        var fieldsToRemove = [
            'id', 'machno', 'machno', 'schedate', 'prodReference', 'glassProdLineID',
            'recordDate', 'feeder', 'spout', 'created', 'modified'
        ];
        fieldsToRemove.forEach(function(fieldName) { // remove unneccessary field/property
            delete record[fieldName];
        });
        // convert true/false values into 1/0's
        record['conveyorHeating'] = (record['conveyorHeating'] === true) ? 1 : 0;
        record['crossBridgeHeating'] = (record['crossBridgeHeating'] === true) ? 1 : 0;
        // loop through record and map data to the form fields
        for (var objectIndex in record) { // loop through the record object by index
            if (record[objectIndex] !== null) { // only process the fields that isn't 'null'
                switch ($('#' + objectIndex).get(0).tagName) {
                    case 'INPUT':
                        if ($('input#' + objectIndex).attr('type') === 'text') {
                            $('input#' + objectIndex).val(record[objectIndex]);
                            break;
                        }
                        if ($('input#' + objectIndex).attr('type') === 'number') {
                            $('input#' + objectIndex).val(record[objectIndex]);
                            break;
                        }
                        if ($('input#' + objectIndex).attr('type') === 'file') {
                            console.log(objectIndex + ": dealing with file input");
                            break;
                        }
                        alert('資料查詢顯示發生錯誤，請與IT聯繫 (input type not checked: ' + objectIndex + ')');
                        break;
                    case 'SELECT':
                        $('select#' + objectIndex).val(record[objectIndex]);
                        break;
                    case 'TEXTAREA':
                        $('textarea#' + objectIndex).val(record[objectIndex]);
                        break;
                    case 'DIV':
                        if ($('div#' + objectIndex).hasClass('checkboxControlHolder')) {
                            console.log('input:checkbox[name="' + objectIndex + '"][value=' + record[objectIndex] + ']');
                            $('input:checkbox[name="' + objectIndex + '"][value=' + record[objectIndex] + ']').prop('checked', true);
                            break;
                        }
                        alert('資料查詢顯示發生錯誤，請與IT聯繫 (unknown control in DIV: ' + objectIndex + ')');
                        break;
                    default:
                        alert('資料查詢顯示發生錯誤，請與IT聯繫 (unknown control type: ' + objectIndex + ')');
                        break;
                }
            }
        }
        // remember to set form data action and method=put
    });
};