'use strict';

var selectOptionListArray = [{ // list to hold select control option data
    id: 'bmHolder',
    optionList: [{
        value: 'NO.1 SG',
        text: 'NO.1 SG'
    }, {
        value: 'NO.2 SG',
        text: 'NO.2 SG'
    }, {
        value: 'NO.3 SG',
        text: 'NO.3 SG'
    }, {
        value: 'NO.1 DG',
        text: 'NO.1 DG'
    }, {
        value: 'NO.2 DG',
        text: 'NO.2 DG'
    }, {
        value: 'NO.3 DG',
        text: 'NO.3 DG'
    }]
}, {
    id: 'fmHolder',
    optionList: [{
        value: 'NO.1 SG',
        text: 'NO.1 SG'
    }, {
        value: 'NO.2 SG',
        text: 'NO.2 SG'
    }, {
        value: 'NO.3 SG',
        text: 'NO.3 SG'
    }, {
        value: 'NO.1 DG',
        text: 'NO.1 DG'
    }, {
        value: 'NO.2 DG',
        text: 'NO.2 DG'
    }, {
        value: 'NO.3 DG',
        text: 'NO.3 DG'
    }]
}, {
    id: 'nrArm',
    optionList: [{
        value: '3&quot; SG',
        text: '3&quot; SG'
    }, {
        value: '3&quot; DG',
        text: '3&quot; DG'
    }]
}, {
    id: 'fuArm',
    optionList: [{
        value: '3-1/4&quot; SG',
        text: '3-1/4&quot; SG'
    }, {
        value: '3-1/4&quot; DG',
        text: '3-1/4&quot; DG'
    }]
}, {
    id: 'thimble',
    optionList: [{
        value: '45mm',
        text: '45mm'
    }, {
        value: '70mm',
        text: '70mm'
    }]
}, {
    id: 'plPositioner',
    optionList: [{
        value: 'B/B',
        text: 'B/B'
    }, {
        value: 'P/B',
        text: 'P/B'
    }]
}, {
    id: 'scoop',
    optionList: [{
        value: 'NO.1 SG',
        text: 'NO.1 SG'
    }, {
        value: 'NO.2 SG',
        text: 'NO.2 SG'
    }, {
        value: 'NO.1 DG',
        text: 'NO.1 DG'
    }, {
        value: 'NO.2 DG',
        text: 'NO.2 DG'
    }, {
        value: 'NO.3 DG',
        text: 'NO.3 DG'
    }]
}, {
    id: 'trough',
    optionList: [{
        value: 'NO.1 SG',
        text: 'NO.1 SG'
    }, {
        value: 'NO.2 SG',
        text: 'NO.2 SG'
    }, {
        value: 'NO.1 DG',
        text: 'NO.1 DG'
    }, {
        value: 'NO.2 DG',
        text: 'NO.2 DG'
    }, {
        value: 'NO.3 DG',
        text: 'NO.3 DG'
    }]
}, {
    id: 'deflector',
    optionList: [{
        value: 'NO.1 SG',
        text: 'NO.1 SG'
    }, {
        value: 'NO.2 SG',
        text: 'NO.2 SG'
    }, {
        value: 'NO.1 DG',
        text: 'NO.1 DG'
    }, {
        value: 'NO.2 DG',
        text: 'NO.2 DG'
    }, {
        value: 'NO.3 DG',
        text: 'NO.3 DG'
    }]
}, {
    id: 'orificeRing',
    optionList: [{
        value: '15.9mm DG',
        text: '15.9mm DG'
    }, {
        value: '17.5mm DG',
        text: '17.5mm DG'
    }, {
        value: '18.3mm DG',
        text: '18.3mm DG'
    }, {
        value: '19.1mm DG',
        text: '19.1mm DG'
    }, {
        value: '19.8mm DG',
        text: '19.8mm DG'
    }, {
        value: '24.5mm SG',
        text: '24.5mm SG'
    }, {
        value: '25.5mm SG',
        text: '25.5mm SG'
    }, {
        value: '27mm SG',
        text: '27mm SG'
    }, {
        value: '28.6mm SG',
        text: '28.6mm SG'
    }, {
        value: '30mm SG',
        text: '30mm SG'
    }]
}, {
    id: 'shearCam',
    optionList: [{
        value: '31°',
        text: '31°'
    }, {
        value: '45°',
        text: '45°'
    }, {
        value: '65°',
        text: '65°'
    }, {
        value: '70°',
        text: '70°'
    }, {
        value: '91°',
        text: '91°'
    }, {
        value: '106°',
        text: '106°'
    }]
}, {
    id: 'shear',
    optionList: [{
        value: 'NO.285',
        text: 'NO.285'
    }, {
        value: 'NO.375',
        text: 'NO.375'
    }]
}, {
    id: 'plunger',
    optionList: [{
        value: '82-1976',
        text: '82-1976'
    }, {
        value: '82-1978',
        text: '82-1978'
    }]
}, {
    id: 'plungerCam',
    optionList: [{
        value: 'NO.1',
        text: 'NO.1'
    }, {
        value: 'NO.2',
        text: 'NO.2'
    }, {
        value: 'NO.3',
        text: 'NO.3'
    }, {
        value: 'NO.4',
        text: 'NO.4'
    }, {
        value: 'NO.5',
        text: 'NO.5'
    }, {
        value: 'NO.6',
        text: 'NO.6'
    }]
}, {
    id: 'bottleSpacing',
    optionList: [{
        value: '10-1/2&quot;',
        text: '10-1/2&quot;'
    }, {
        value: '21&quot;',
        text: '21&quot;'
    }]
}, {
    id: 'nrGauge',
    optionList: [{
        value: '0.8mm',
        text: '0.8mm'
    }, {
        value: '0.8mm',
        text: '1.2mm'
    }]
}, {
    id: 'coolingPressure',
    optionList: [{
        value: '全開',
        text: '全開'
    }, {
        value: '4/5',
        text: '4/5'
    }, {
        value: '3/4',
        text: '3/4'
    }, {
        value: '2/3',
        text: '2/3'
    }, {
        value: '1/2',
        text: '1/2'
    }, {
        value: '1/3',
        text: '1/3'
    }, {
        value: '1/4',
        text: '1/4'
    }, {
        value: '1/5',
        text: '1/5'
    }, {
        value: '關閉',
        text: '關閉'
    }]
}];

var checkInputListArray = [{ // list to hold checkbox control option data
    id: 'conveyorHeating',
    optionList: [{
        value: 1,
        text: '有'
    }, {
        value: 0,
        text: '無'
    }]
}, {
    id: 'crossBridgeHeating',
    optionList: [{
        value: 1,
        text: '有'
    }, {
        value: 0,
        text: '無'
    }]
}];