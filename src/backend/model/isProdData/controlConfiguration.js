const serverConfig = require('../../module/serverConfig.js');

const selectOptionListArray = [{
    id: 'formState',
    optionList: [{
        value: 0,
        text: '待初始化'
    }, {
        value: 1,
        text: '空白記錄'
    }, {
        value: 2,
        text: '新建記錄(待儲存)'
    }, {
        value: 3,
        text: '歷史記錄'
    }, {
        value: 4,
        text: '歷史記錄(待儲存)'
    }]
}, { // list to hold select control option data
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
        value: 'NO.4 SG',
        text: 'NO.4 SG'
    }, {
        value: 'NO.5 SG',
        text: 'NO.5 SG'
    }, {
        value: 'NO.6 SG',
        text: 'NO.6 SG'
    }, {
        value: 'NO.1-1 SG (DG 尺寸)',
        text: 'NO.1-1 SG (DG 尺寸)'
    }, {
        value: 'NO.1-2 SG (DG 尺寸)',
        text: 'NO.1-2 SG (DG 尺寸)'
    }, {
        value: 'NO.1 SG (DG 尺寸)',
        text: 'NO.1 SG (DG 尺寸)'
    }, {
        value: 'NO.2 SG (DG 尺寸)',
        text: 'NO.2 SG (DG 尺寸)'
    }, {
        value: 'NO.3 SG (DG 尺寸)',
        text: 'NO.3 SG (DG 尺寸)'
    }, {
        value: 'NO.4 SG (DG 尺寸)',
        text: 'NO.4 SG (DG 尺寸)'
    }, {
        value: 'NO.5 SG (DG 尺寸)',
        text: 'NO.5 SG (DG 尺寸)'
    }, {
        value: 'NO.6 SG (DG 尺寸)',
        text: 'NO.6 SG (DG 尺寸)'
    }, {
        value: 'NO.7 SG (DG 尺寸)',
        text: 'NO.7 SG (DG 尺寸)'
    }, {
        value: 'NO.12 SG (DG 尺寸)',
        text: 'NO.12 SG (DG 尺寸)'
    }, {
        value: 'NO.13 SG (DG 尺寸)',
        text: 'NO.13 SG (DG 尺寸)'
    }, {
        value: 'NO.16 SG (DG 尺寸)',
        text: 'NO.16 SG (DG 尺寸)'
    }, {
        value: 'NO.17 SG (DG 尺寸)',
        text: 'NO.17 SG (DG 尺寸)'
    }, {
        value: 'Φ65 DG',
        text: 'Φ65 DG'
    }, {
        value: 'Φ75 DG',
        text: 'Φ75 DG'
    }, {
        value: 'NO.1 DG',
        text: 'NO.1 DG'
    }, {
        value: 'NO.2 DG',
        text: 'NO.2 DG'
    }, {
        value: 'NO.3 DG',
        text: 'NO.3 DG'
    }, {
        value: 'NO.4 DG',
        text: 'NO.4 DG'
    }, {
        value: 'NO.5 DG',
        text: 'NO.5 DG'
    }, {
        value: 'NO.6 DG',
        text: 'NO.6 DG'
    }, {
        value: 'NO.7 DG',
        text: 'NO.7 DG'
    }, {
        value: 'Φ108 DG',
        text: 'Φ108 DG'
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
        value: 'NO.4 SG',
        text: 'NO.4 SG'
    }, {
        value: 'NO.5 SG',
        text: 'NO.5 SG'
    }, {
        value: 'NO.6 SG',
        text: 'NO.6 SG'
    }, {
        value: 'NO.1-1 SG (DG 尺寸)',
        text: 'NO.1-1 SG (DG 尺寸)'
    }, {
        value: 'NO.1-2 SG (DG 尺寸)',
        text: 'NO.1-2 SG (DG 尺寸)'
    }, {
        value: 'NO.1 SG (DG 尺寸)',
        text: 'NO.1 SG (DG 尺寸)'
    }, {
        value: 'NO.2 SG (DG 尺寸)',
        text: 'NO.2 SG (DG 尺寸)'
    }, {
        value: 'NO.3 SG (DG 尺寸)',
        text: 'NO.3 SG (DG 尺寸)'
    }, {
        value: 'NO.4 SG (DG 尺寸)',
        text: 'NO.4 SG (DG 尺寸)'
    }, {
        value: 'NO.5 SG (DG 尺寸)',
        text: 'NO.5 SG (DG 尺寸)'
    }, {
        value: 'NO.6 SG (DG 尺寸)',
        text: 'NO.6 SG (DG 尺寸)'
    }, {
        value: 'NO.7 SG (DG 尺寸)',
        text: 'NO.7 SG (DG 尺寸)'
    }, {
        value: 'NO.12 SG (DG 尺寸)',
        text: 'NO.12 SG (DG 尺寸)'
    }, {
        value: 'NO.13 SG (DG 尺寸)',
        text: 'NO.13 SG (DG 尺寸)'
    }, {
        value: 'NO.16 SG (DG 尺寸)',
        text: 'NO.16 SG (DG 尺寸)'
    }, {
        value: 'NO.17 SG (DG 尺寸)',
        text: 'NO.17 SG (DG 尺寸)'
    }, {
        value: 'Φ65 DG',
        text: 'Φ65 DG'
    }, {
        value: 'Φ75 DG',
        text: 'Φ75 DG'
    }, {
        value: 'NO.1 DG',
        text: 'NO.1 DG'
    }, {
        value: 'NO.2 DG',
        text: 'NO.2 DG'
    }, {
        value: 'NO.3 DG',
        text: 'NO.3 DG'
    }, {
        value: 'NO.4 DG',
        text: 'NO.4 DG'
    }, {
        value: 'NO.5 DG',
        text: 'NO.5 DG'
    }, {
        value: 'NO.6 DG',
        text: 'NO.6 DG'
    }, {
        value: 'NO.7 DG',
        text: 'NO.7 DG'
    }, {
        value: 'Φ108 DG',
        text: 'Φ108 DG'
    }]
}, {
    id: 'nrArm',
    optionList: [{
        value: '3&quot;',
        text: '3&quot;'
    }, {
        value: 'NO. 1',
        text: 'NO. 1'
    }, {
        value: 'NO. 2',
        text: 'NO. 2'
    }, {
        value: 'NO. 3',
        text: 'NO. 3'
    }]
}, {
    id: 'fuArm',
    optionList: [{
        value: '2-7/8&quot;',
        text: '2-7/8&quot;'
    }, {
        value: '3-1/4&quot;',
        text: '3-1/4&quot;'
    }, {
        value: '3-1/2&quot;',
        text: '3-1/2&quot;'
    }, {
        value: '4-1/2&quot;',
        text: '4-1/2&quot;'
    }, {
        value: '5&quot;',
        text: '5&quot;'
    }]
}, {
    id: 'thimble',
    optionList: [{
        value: '53mm',
        text: '53mm'
    }, {
        value: '58mm',
        text: '58mm'
    }, {
        value: '70mm',
        text: '70mm'
    }, {
        value: '70mm (特殊)',
        text: '70mm (特殊)'
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
        value: '5/8',
        text: '5/8'
    }, {
        value: '3/8-3/4',
        text: '3/8-3/4'
    }, {
        value: 'NO.0-2',
        text: 'NO.0-2'
    }, {
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
        value: 'NO.2-3',
        text: 'NO.2-3'
    }, {
        value: 'NO.3-4',
        text: 'NO.3-4'
    }, {
        value: 'NO.0',
        text: 'NO.0'
    }]
}, {
    id: 'trough',
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
        value: 'NO.0-2',
        text: 'NO.0-2'
    }, {
        value: 'NO.0-3',
        text: 'NO.0-3'
    }, {
        value: 'NO.2-3',
        text: 'NO.2-3'
    }, {
        value: 'NO.3-4',
        text: 'NO.3-4'
    }, {
        value: 'NO.0',
        text: 'NO.0'
    }, {
        value: '5/8&quot;',
        text: '5/8&quot;'
    }, {
        value: '3/4&quot;',
        text: '3/4&quot;'
    }, {
        value: '7/8&quot;',
        text: '7/8&quot;'
    }]
}, {
    id: 'deflector',
    optionList: [{
        value: '3/8&quot;',
        text: '3/8&quot;'
    }, {
        value: '1/2&quot;',
        text: '1/2&quot;'
    }, {
        value: '5/8&quot;',
        text: '5/8&quot;'
    }, {
        value: '3/4&quot;',
        text: '3/4&quot;'
    }, {
        value: '7/8&quot;',
        text: '7/8&quot;'
    }, {
        value: '1&quot;',
        text: '1&quot;'
    }, {
        value: '1-1/8&quot;',
        text: '1-1/8&quot;'
    }, {
        value: '1-1/4&quot;',
        text: '1-1/4&quot;'
    }, {
        value: '1-3/8&quot;',
        text: '1-3/8&quot;'
    }, {
        value: '1-1/2&quot;',
        text: '1-1/2&quot;'
    }, {
        value: '1-5/8&quot;',
        text: '1-5/8&quot;'
    }, {
        value: '1-3/4&quot;',
        text: '1-3/4&quot;'
    }, {
        value: '1-7/8&quot;',
        text: '1-7/8&quot;'
    }, {
        value: '2&quot;',
        text: '2&quot;'
    }, {
        value: '2-1/8&quot;',
        text: '2-1/8&quot;'
    }, {
        value: '2-3/8&quot;',
        text: '2-3/8&quot;'
    }, {
        value: '2-1/4&quot;',
        text: '2-1/4&quot;'
    }, {
        value: '2-3/4&quot;',
        text: '2-3/4&quot;'
    }]
}, {
    id: 'orificeRing',
    optionList: [{
        erpReference: 'P12000001',
        value: '12.7mm DG',
        text: '12.7mm DG',
        orificeSize: 12.7,
        orificeCount: 2,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A81-3851',
        note: null
    }, {
        erpReference: 'P12000002',
        value: '14.3mm DG',
        text: '14.3mm DG',
        orificeSize: 14.3,
        orificeCount: 2,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A81-3853',
        note: null
    }, {
        erpReference: 'P12000003',
        value: '15.1mm DG',
        text: '15.1mm DG',
        orificeSize: 15.1,
        orificeCount: 2,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A81-3854',
        note: null
    }, {
        erpReference: 'P12000004',
        value: '15.9mm DG',
        text: '15.9mm DG',
        orificeSize: 15.9,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3855',
        note: null
    }, {
        erpReference: 'P12000005',
        value: '17.5mm DG',
        text: '17.5mm DG',
        orificeSize: 17.5,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3857',
        note: null
    }, {
        erpReference: 'P12000006',
        value: '18.3mm DG',
        text: '18.3mm DG',
        orificeSize: 18.3,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3858',
        note: null
    }, {
        erpReference: 'P12000007',
        value: '19.2mm DG',
        text: '19.2mm DG',
        orificeSize: 19.2,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3859',
        note: null
    }, {
        erpReference: 'P12000008',
        value: '19.8mm DG',
        text: '19.8mm DG',
        orificeSize: 19.8,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3860',
        note: null
    }, {
        erpReference: 'P12000009',
        value: '20.6mm DG',
        text: '20.6mm DG',
        orificeSize: 20.6,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3861',
        note: null
    }, {
        erpReference: 'P12000010',
        value: '21.5mm DG',
        text: '21.5mm DG',
        orificeSize: 21.5,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3862',
        note: null
    }, {
        erpReference: 'P12000011',
        value: '22.2mm DG',
        text: '22.2mm DG',
        orificeSize: 22.2,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3863',
        note: null
    }, {
        erpReference: 'P12000012',
        value: '23.8mm DG',
        text: '23.8mm DG',
        orificeSize: 23.8,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3865',
        note: null
    }, {
        erpReference: 'P12000013',
        value: '24.6mm DG',
        text: '24.6mm DG',
        orificeSize: 24.6,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3866',
        note: null
    }, {
        erpReference: 'P12000014',
        value: '25.5mm DG',
        text: '25.5mm DG',
        orificeSize: 25.5,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3867',
        note: null
    }, {
        erpReference: 'P12000015',
        value: '27mm DG',
        text: '27mm DG',
        orificeSize: 27,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3868',
        note: null
    }, {
        erpReference: 'P13000001',
        value: '28.6mm DG',
        text: '28.6mm DG',
        orificeSize: 28.6,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3869',
        note: null
    }, {
        erpReference: 'P13000002',
        value: '30.2mm DG',
        text: '30.2mm DG',
        orificeSize: 30.2,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3870',
        note: null
    }, {
        erpReference: 'P13000003',
        value: '31.5mm DG',
        text: '31.5mm DG',
        orificeSize: 31.5,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3871',
        note: null
    }, {
        erpReference: 'P13000004',
        value: '33.5mm DG',
        text: '33.5mm DG',
        orificeSize: 33.5,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3872',
        note: null
    }, {
        erpReference: 'P13000005',
        value: '34.9mm DG',
        text: '34.9mm DG',
        orificeSize: 34.9,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3873',
        note: null
    }, {
        erpReference: 'P13000006',
        value: '36.5mm DG',
        text: '36.5mm DG',
        orificeSize: 36.5,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3874',
        note: null
    }, {
        erpReference: 'P13000007',
        value: '38.1mm DG',
        text: '38.1mm DG',
        orificeSize: 38.1,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3875',
        note: null
    }, {
        erpReference: 'P13000008',
        value: '39.7mm DG',
        text: '39.7mm DG',
        orificeSize: 39.7,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3876',
        note: null
    }, {
        erpReference: 'P13000009',
        value: '41.3mm DG',
        text: '41.3mm DG',
        orificeSize: 41.3,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3877',
        note: null
    }, {
        erpReference: 'P13000010',
        value: '42.9mm DG',
        text: '42.9mm DG',
        orificeSize: 42.9,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3878',
        note: null
    }, {
        erpReference: 'P13000011',
        value: '44.5mm DG',
        text: '44.5mm DG',
        orificeSize: 44.5,
        orificeCount: 2,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A81-3879',
        note: null
    }, {
        erpReference: 'P14000001',
        value: '46mm DG',
        text: '46mm DG',
        orificeSize: 46,
        orificeCount: 2,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A81-3880',
        note: null
    }, {
        erpReference: 'P14000002',
        value: '47.5mm DG',
        text: '47.5mm DG',
        orificeSize: 47.5,
        orificeCount: 2,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A81-3881',
        note: null
    }, {
        erpReference: 'P14000003',
        value: '50.8mm DG',
        text: '50.8mm DG',
        orificeSize: 50.8,
        orificeCount: 2,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A81-3883',
        note: null
    }, {
        erpReference: 'P14000004',
        value: '54mm DG',
        text: '54mm DG',
        orificeSize: 54,
        orificeCount: 2,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A81-3885',
        note: null
    }, {
        erpReference: 'P11000031',
        value: '15mm SG',
        text: '15mm SG',
        orificeSize: 15,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10262',
        note: null
    }, {
        erpReference: 'P11000032',
        value: '16mm SG',
        text: '16mm SG',
        orificeSize: 16,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10263',
        note: null
    }, {
        erpReference: 'P11000033',
        value: '17.5mm SG',
        text: '17.5mm SG',
        orificeSize: 17.5,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10265',
        note: null
    }, {
        erpReference: 'P11000034',
        value: '18mm SG',
        text: '18mm SG',
        orificeSize: 18,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10266',
        note: null
    }, {
        erpReference: 'P11000035',
        value: '20mm SG',
        text: '20mm SG',
        orificeSize: 20,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10267',
        note: null
    }, {
        erpReference: 'P11000036',
        value: '20.5mm SG',
        text: '20.5mm SG',
        orificeSize: 20.5,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10268',
        note: null
    }, {
        erpReference: 'P11000037',
        value: '21.5mm SG',
        text: '21.5mm SG',
        orificeSize: 21.5,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10269',
        note: null
    }, {
        erpReference: 'P11000038',
        value: '22mm SG',
        text: '22mm SG',
        orificeSize: 22,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10270',
        note: null
    }, {
        erpReference: 'P11000039',
        value: '23mm SG',
        text: '23mm SG',
        orificeSize: 23,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10271',
        note: null
    }, {
        erpReference: 'P11000040',
        value: '24.5mm SG',
        text: '24.5mm SG',
        orificeSize: 24.5,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10273',
        note: null
    }, {
        erpReference: 'P11000030',
        value: '25.5mm SG',
        text: '25.5mm SG',
        orificeSize: 25.5,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10274',
        note: null
    }, {
        erpReference: 'P11000024',
        value: '27mm SG',
        text: '27mm SG',
        orificeSize: 27,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10275',
        note: null
    }, {
        erpReference: 'P11000025',
        value: '28.6mm SG',
        text: '28.6mm SG',
        orificeSize: 28.6,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10276',
        note: null
    }, {
        erpReference: 'P11000026',
        value: '30mm SG',
        text: '30mm SG',
        orificeSize: 30,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10277',
        note: null
    }, {
        erpReference: 'P11000002',
        value: '33.3mm SG',
        text: '33.3mm SG',
        orificeSize: 33.3,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10279',
        note: null
    }, {
        erpReference: 'P11000003',
        value: '36.5mm SG',
        text: '36.5mm SG',
        orificeSize: 36.5,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10281',
        note: null
    }, {
        erpReference: 'P11000004',
        value: '38mm SG',
        text: '38mm SG',
        orificeSize: 38,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10282',
        note: null
    }, {
        erpReference: 'P11000005',
        value: '39.7mm SG',
        text: '39.7mm SG',
        orificeSize: 39.7,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10283',
        note: null
    }, {
        erpReference: 'P11000001',
        value: '41.3mm SG',
        text: '41.3mm SG',
        orificeSize: 41.3,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10165',
        note: null
    }, {
        erpReference: 'P11000006',
        value: '42.9mm SG',
        text: '42.9mm SG',
        orificeSize: 42.9,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10284',
        note: null
    }, {
        erpReference: 'P11000007',
        value: '44mm SG',
        text: '44mm SG',
        orificeSize: 44,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10284K',
        note: null
    }, {
        erpReference: 'P11000008',
        value: '44.5mm SG',
        text: '44.5mm SG',
        orificeSize: 44.5,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10285',
        note: null
    }, {
        erpReference: 'P11000009',
        value: '46mm SG',
        text: '46mm SG',
        orificeSize: 46,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10286',
        note: null
    }, {
        erpReference: 'P11000010',
        value: '47.6mm SG',
        text: '47.6mm SG',
        orificeSize: 47.6,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10287',
        note: null
    }, {
        erpReference: 'P11000011',
        value: '49.2mm SG',
        text: '49.2mm SG',
        orificeSize: 49.2,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10288',
        note: null
    }, {
        erpReference: 'P11000012',
        value: '52.4mm SG',
        text: '52.4mm SG',
        orificeSize: 52.4,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10290',
        note: null
    }, {
        erpReference: 'P11000013',
        value: '54mm SG',
        text: '54mm SG',
        orificeSize: 54,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10291',
        note: null
    }, {
        erpReference: 'P11000014',
        value: '57.2mm SG',
        text: '57.2mm SG',
        orificeSize: 57.2,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10293',
        note: null
    }, {
        erpReference: 'P11000015',
        value: '58.7mm SG',
        text: '58.7mm SG',
        orificeSize: 58.7,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10294',
        note: null
    }, {
        erpReference: 'P11000016',
        value: '63.5mm SG',
        text: '63.5mm SG',
        orificeSize: 63.5,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10297',
        note: null
    }, {
        erpReference: 'P11000017',
        value: '65.1mm SG',
        text: '65.1mm SG',
        orificeSize: 65.1,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10298',
        note: null
    }, {
        erpReference: 'P11000018',
        value: '69.9mm SG',
        text: '69.9mm SG',
        orificeSize: 69.9,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10301',
        note: null
    }, {
        erpReference: 'P11000019',
        value: '73mm SG',
        text: '73mm SG',
        orificeSize: 73,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10303',
        note: null
    }, {
        erpReference: 'P11000020',
        value: '76.2mm SG',
        text: '76.2mm SG',
        orificeSize: 76.2,
        orificeCount: 1,
        displayFlag: true,
        customFlag: false,
        supplierReference: 'A144-10305',
        note: null
    }, {
        erpReference: 'P11000021',
        value: '79.4mm SG',
        text: '79.4mm SG',
        orificeSize: 79.4,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: '58-2904',
        note: null
    }, {
        erpReference: 'P11000027',
        value: '81mm SG',
        text: '81mm SG',
        orificeSize: 81,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10308',
        note: null
    }, {
        erpReference: 'P11000022',
        value: '82.6mm SG',
        text: '82.6mm SG',
        orificeSize: 82.6,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: '58-2905',
        note: null
    }, {
        erpReference: 'P11000028',
        value: '83mm SG',
        text: '83mm SG',
        orificeSize: 83,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10309',
        note: null
    }, {
        erpReference: 'P11000023',
        value: '85.7mm SG',
        text: '85.7mm SG',
        orificeSize: 85.7,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: '58-2906',
        note: null
    }, {
        erpReference: 'P11000029',
        value: '86mm SG',
        text: '86mm SG',
        orificeSize: 86,
        orificeCount: 1,
        displayFlag: false,
        customFlag: false,
        supplierReference: 'A144-10311',
        note: null
    }]
}, {
    id: 'shearCam',
    optionList: [{
        value: '20°',
        text: '20°',
        displayFlag: false
    }, {
        value: '31°',
        text: '31°',
        displayFlag: true
    }, {
        value: '41°',
        text: '41°',
        displayFlag: true
    }, {
        value: '49°',
        text: '49°',
        displayFlag: true
    }, {
        value: '50°',
        text: '50°',
        displayFlag: false
    }, {
        value: '61°',
        text: '61°',
        displayFlag: true
    }, {
        value: '65°',
        text: '65°',
        displayFlag: false
    }, {
        value: '70°',
        text: '70°',
        displayFlag: true
    }, {
        value: '80°',
        text: '80°',
        displayFlag: true
    }, {
        value: '91°',
        text: '91°',
        displayFlag: true
    }, {
        value: '106°',
        text: '106°',
        displayFlag: true
    }, {
        value: '113°',
        text: '113°',
        displayFlag: true
    }, {
        value: '特殊',
        text: '特殊',
        displayFlag: false
    }]
}, {
    id: 'shear',
    optionList: [{
        value: 'NO.1',
        text: 'NO.1'
    }, {
        value: 'NO.285',
        text: 'NO.285'
    }, {
        value: 'NO.375',
        text: 'NO.375'
    }, {
        value: 'NO.4',
        text: 'NO.4'
    }]
}, {
    id: 'plunger',
    optionList: [{
        value: '29-610',
        text: '29-610',
        displayFlag: true
    }, {
        value: '29-611',
        text: '29-611',
        displayFlag: true
    }, {
        value: '29-612',
        text: '29-612',
        displayFlag: true
    }, {
        value: '58-2573',
        text: '58-2573',
        displayFlag: true
    }, {
        value: '58-2574',
        text: '58-2574',
        displayFlag: true
    }, {
        value: '58-2575',
        text: '58-2575',
        displayFlag: true
    }, {
        value: '81-3920',
        text: '81-3920',
        displayFlag: true
    }, {
        value: '81-3928',
        text: '81-3928',
        displayFlag: true
    }, {
        value: '81-3929',
        text: '81-3929',
        displayFlag: true
    }]
}, {
    id: 'plungerCam',
    optionList: [{
        value: 'NO.1',
        text: 'NO.1',
        displayFlag: true
    }, {
        value: 'NO.2',
        text: 'NO.2',
        displayFlag: true
    }, {
        value: 'NO.3',
        text: 'NO.3',
        displayFlag: true
    }, {
        value: 'NO.4',
        text: 'NO.4',
        displayFlag: true
    }, {
        value: 'NO.4-1/2',
        text: 'NO.4-2/1',
        displayFlag: false
    }, {
        value: 'NO.5',
        text: 'NO.5',
        displayFlag: true
    }, {
        value: 'NO.5-1/4',
        text: 'NO.5-1/4',
        displayFlag: false
    }, {
        value: 'NO.5-1/2',
        text: 'NO.5-1/2',
        displayFlag: false
    }, {
        value: 'NO.6',
        text: 'NO.6',
        displayFlag: true
    }, {
        value: 'NO.7(正)',
        text: 'NO.7(正)',
        displayFlag: true
    }, {
        value: 'NO.7(反)',
        text: 'NO.7(反)',
        displayFlag: true
    }, {
        value: 'NO.12',
        text: 'NO.12',
        displayFlag: true
    }, {
        value: 'HS-556',
        text: 'HS-556',
        displayFlag: true
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

const checkboxOptionArray = [{ // list to hold checkbox control option data
    id: 'conveyorHeating',
    multiSelect: false,
    optionList: [{
        value: true,
        text: '有',
        default: false
    }, {
        value: false,
        text: '無',
        default: false
    }]
}, {
    id: 'crossBridgeHeating',
    multiSelect: false,
    optionList: [{
        value: true,
        text: '有',
        default: false
    }, {
        value: false,
        text: '無',
        default: false
    }]
}];

const textAutocompleteOptionArray = [{
    id: 'glassProdLineID',
    mirrorTarget: 'machno',
    minLength: 0,
    optionList: [{
        label: 'L1-1',
        value: '1-1 1-1線'
    }, {
        label: 'L1',
        value: '01 1線'
    }, {
        label: 'L2',
        value: '02 2線'
    }, {
        label: 'L3',
        value: '03 3線'
    }, {
        label: 'L5',
        value: '04 5線'
    }, {
        label: 'L6',
        value: '05 6線'
    }, {
        label: 'L7',
        value: '06 7線'
    }, {
        label: 'L8',
        value: '07 8線'
    }]
}, {
    id: 'mockProdReference',
    mirrorTarget: 'prd_no',
    minLength: 2,
    optionList: serverConfig.publicServerUrl + '/erp/prdt'
}];

module.exports = {
    checkboxOptionArray: checkboxOptionArray,
    selectOptionListArray: selectOptionListArray,
    textAutocompleteOptionArray: textAutocompleteOptionArray
};
