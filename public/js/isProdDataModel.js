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
    optionList: [
        { erpReference: 'P12000001', value: '12.7mm DG', text: '12.7mm DG', orificeSize: 12.7, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3851' },
        { erpReference: 'P12000002', value: '14.3mm DG', text: '14.3mm DG', orificeSize: 14.3, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3853' },
        { erpReference: 'P12000003', value: '14.3mm DG', text: '15.1mm DG', orificeSize: 15.1, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3854' },
        { erpReference: 'P12000004', value: '14.3mm DG', text: '15.9mm DG', orificeSize: 15.9, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3855' },
        { erpReference: 'P12000005', value: '14.3mm DG', text: '17.5mm DG', orificeSize: 17.5, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3857' },
        { erpReference: 'P12000006', value: '14.3mm DG', text: '18.3mm DG', orificeSize: 18.3, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3858' },
        { erpReference: 'P12000007', value: '14.3mm DG', text: '19.1mm DG', orificeSize: 19.2, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3859' },
        { erpReference: 'P12000008', value: '14.3mm DG', text: '19.8mm DG', orificeSize: 19.8, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3860' },
        { erpReference: 'P12000009', value: '14.3mm DG', text: '20.6mm DG', orificeSize: 20.6, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3861' },
        { erpReference: 'P12000010', value: '14.3mm DG', text: '21.5mm DG', orificeSize: 21.5, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3862' },
        { erpReference: 'P12000011', value: '14.3mm DG', text: '22.2mm DG', orificeSize: 22.2, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3863' },
        { erpReference: 'P12000013', value: '14.3mm DG', text: '24.6mm DG', orificeSize: 24.6, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3866' },
        { erpReference: 'P12000014', value: '14.3mm DG', text: '25.5mm DG', orificeSize: 25.5, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3867' },
        { erpReference: 'P12000015', value: '14.3mm DG', text: '27mm DG', orificeSize: 27, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3868' },
        { erpReference: 'P13000001', value: '14.3mm DG', text: '28.6mm DG', orificeSize: 28.6, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3869' },
        { erpReference: 'P13000002', value: '14.3mm DG', text: '30.2mm DG', orificeSize: 30.2, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3870' },
        { erpReference: 'P13000003', value: '14.3mm DG', text: '31.5mm DG', orificeSize: 31.5, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3871' },
        { erpReference: 'P13000004', value: '14.3mm DG', text: '33.5mm DG', orificeSize: 33.5, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3872' },
        { erpReference: 'P13000005', value: '14.3mm DG', text: '34.9mm DG', orificeSize: 34.9, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3873' },
        { erpReference: 'P13000006', value: '14.3mm DG', text: '36.5mm DG', orificeSize: 36.5, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3874' },
        { erpReference: 'P13000007', value: '14.3mm DG', text: '38.1mm DG', orificeSize: 38.1, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3875' },
        { erpReference: 'P13000008', value: '14.3mm DG', text: '39.7mm DG', orificeSize: 39.7, orificeCount: 2, displayFlag: true, customFlag: false, supplierReference: 'A81-3876' },
        { erpReference: 'P13000009', value: '14.3mm DG', text: '41.3mm DG', orificeSize: 41.3, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3877' },
        { erpReference: 'P13000010', value: '14.3mm DG', text: '42.9mm DG', orificeSize: 42.9, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3878' },
        { erpReference: 'P13000011', value: '14.3mm DG', text: '44.5mm DG', orificeSize: 44.5, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3879' },
        { erpReference: 'P12000012', value: '14.3mm DG', text: '23.8mm DG', orificeSize: 23.8, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3865' },
        { erpReference: 'P11000031', value: '14.3mm DG', text: '15mm SG', orificeSize: 15, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10262' },
        { erpReference: 'P11000032', value: '14.3mm DG', text: '16mm SG', orificeSize: 16, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10263' },
        { erpReference: 'P11000033', value: '14.3mm DG', text: '17.5mm SG', orificeSize: 17.5, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10265' },
        { erpReference: 'P11000034', value: '14.3mm DG', text: '18mm SG', orificeSize: 18, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10266' },
        { erpReference: 'P11000035', value: '14.3mm DG', text: '20mm SG', orificeSize: 20, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10267' },
        { erpReference: 'P11000036', value: '14.3mm DG', text: '20.5mm SG', orificeSize: 20.5, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10268' },
        { erpReference: 'P11000037', value: '14.3mm DG', text: '21.5mm SG', orificeSize: 21.5, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10269' },
        { erpReference: 'P11000038', value: '14.3mm DG', text: '22mm SG', orificeSize: 22, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10270' },
        { erpReference: 'P11000039', value: '14.3mm DG', text: '23mm SG', orificeSize: 23, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10271' },
        { erpReference: 'P11000040', value: '14.3mm DG', text: '24.5mm SG', orificeSize: 24.5, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10273' },
        { erpReference: 'P11000030', value: '14.3mm DG', text: '25.5mm SG', orificeSize: 25.5, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10274' },
        { erpReference: 'P11000024', value: '14.3mm DG', text: '27mm SG', orificeSize: 27, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10275' },
        { erpReference: 'P11000025', value: '14.3mm DG', text: '28.6mm SG', orificeSize: 28.6, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10276' },
        { erpReference: 'P11000026', value: '14.3mm DG', text: '30mm SG', orificeSize: 30, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10277' },
        { erpReference: 'P11000002', value: '14.3mm DG', text: '33.3mm SG', orificeSize: 33.3, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10279' },
        { erpReference: 'P11000003', value: '14.3mm DG', text: '36.5mm SG', orificeSize: 36.5, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10281' },
        { erpReference: 'P11000004', value: '14.3mm DG', text: '38mm SG', orificeSize: 38, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10282' },
        { erpReference: 'P11000005', value: '14.3mm DG', text: '39.7mm SG', orificeSize: 39.7, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10283' },
        { erpReference: 'P11000001', value: '14.3mm DG', text: '41.3mm SG', orificeSize: 41.3, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10165' },
        { erpReference: 'P11000006', value: '14.3mm DG', text: '42.9mm SG', orificeSize: 42.9, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10284' },
        { erpReference: 'P11000007', value: '14.3mm DG', text: '44mm SG', orificeSize: 44, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10284K' },
        { erpReference: 'P11000008', value: '14.3mm DG', text: '44.5mm SG', orificeSize: 44.5, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10285' },
        { erpReference: 'P11000009', value: '14.3mm DG', text: '46mm SG', orificeSize: 46, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10286' },
        { erpReference: 'P11000010', value: '14.3mm DG', text: '47.6mm SG', orificeSize: 47.6, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10287' },
        { erpReference: 'P11000011', value: '14.3mm DG', text: '49.2mm SG', orificeSize: 49.2, orificeCount: 1, displayFlag: true, customFlag: false, supplierReference: 'A144-10288' },
        { erpReference: 'P11000012', value: '14.3mm DG', text: '52.4mm SG', orificeSize: 52.4, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10290' },
        { erpReference: 'P11000013', value: '14.3mm DG', text: '54mm SG', orificeSize: 54, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10291' },
        { erpReference: 'P11000014', value: '14.3mm DG', text: '57.2mm SG', orificeSize: 57.2, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10293' },
        { erpReference: 'P11000015', value: '14.3mm DG', text: '58.7mm SG', orificeSize: 58.7, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10294' },
        { erpReference: 'P11000016', value: '14.3mm DG', text: '63.5mm SG', orificeSize: 63.5, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10297' },
        { erpReference: 'P11000017', value: '14.3mm DG', text: '65.1mm SG', orificeSize: 65.1, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10298' },
        { erpReference: 'P11000018', value: '14.3mm DG', text: '69.9mm SG', orificeSize: 69.9, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10301' },
        { erpReference: 'P11000019', value: '14.3mm DG', text: '73mm SG', orificeSize: 73, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10303' },
        { erpReference: 'P11000020', value: '14.3mm DG', text: '76.2mm SG', orificeSize: 76.2, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10305' },
        { erpReference: 'P11000021', value: '14.3mm DG', text: '79.4mm SG', orificeSize: 79.4, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: '58-2904' },
        { erpReference: 'P11000027', value: '14.3mm DG', text: '81mm SG', orificeSize: 81, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10308' },
        { erpReference: 'P11000022', value: '14.3mm DG', text: '82.6mm SG', orificeSize: 82.6, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: '58-2905' },
        { erpReference: 'P11000028', value: '14.3mm DG', text: '83mm SG', orificeSize: 83, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10309' },
        { erpReference: 'P11000023', value: '14.3mm DG', text: '85.7mm SG', orificeSize: 85.7, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: '58-2906' },
        { erpReference: 'P11000029', value: '14.3mm DG', text: '86mm SG', orificeSize: 86, orificeCount: 1, displayFlag: false, customFlag: false, supplierReference: 'A144-10311' },
        { erpReference: 'P14000001', value: '14.3mm DG', text: '46mm DG', orificeSize: 46, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3880' },
        { erpReference: 'P14000002', value: '14.3mm DG', text: '47.5mm DG', orificeSize: 47.5, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3881' },
        { erpReference: 'P14000003', value: '14.3mm DG', text: '50.8mm DG', orificeSize: 50.8, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3883' },
        { erpReference: 'P14000004', value: '14.3mm DG', text: '54mm DG', orificeSize: 54, orificeCount: 2, displayFlag: false, customFlag: false, supplierReference: 'A81-3885' }
    ]
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