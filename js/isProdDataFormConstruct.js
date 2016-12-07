"use strict";

var isProdDataFormElementList = {
    title: "統義玻璃工業股份有限公司",
    subtitle: "製造課生產條件記錄表",
    sectionCount: 2,
    sectionList: [
        [{
            id: "prodReferenceInput",
            name: "prodReference",
            label: "瓶號",
            type: "text"
        }, {
            id: "productionWeightInput",
            name: "productionWeightInput",
            label: "重量",
            type: "number",
            min: 1,
            step: 0.1
        }, {
            id: "glassProdLineIDSelect",
            name: "glassProdLineIDSelect",
            label: "生產線",
            type: "select",
            optionList: [{
                value: 1,
                text: "L1-1"
            }, {
                value: 2,
                text: "L1"
            }, {
                value: 3,
                text: "L2"
            }, {
                value: 4,
                text: "L3"
            }, {
                value: 5,
                text: "L5"
            }, {
                value: 6,
                text: "L6"
            }, {
                value: 7,
                text: "L7"
            }, {
                value: 8,
                text: "L8"
            }]
        }, {
            id: "recordDateDate",
            name: "recordDateDate",
            type: "date",
            label: "日期"
        }],
        [{
            id: "blankSideHolderSelect",
            name: "blankSideHolderSelect",
            label: "初模抱具",
            type: "select",
            optionList: [{
                value: 1,
                text: "NO. 1 SG"
            }, {
                value: 2,
                text: "NO. 2 SG"
            }, {
                value: 3,
                text: "NO. 3 SG"
            }, {
                value: 4,
                text: "NO. 1 DG"
            }, {
                value: 5,
                text: "NO. 2 DG"
            }, {
                value: 6,
                text: "NO. 3 DG"
            }]
        }, {
            id: "blowSideHolderSelect",
            name: "blowSideHolderSelect",
            label: "成模抱具",
            type: "select",
            optionList: [{
                value: 1,
                text: "NO. 1 SG"
            }, {
                value: 2,
                text: "NO. 2 SG"
            }, {
                value: 3,
                text: "NO. 3 SG"
            }, {
                value: 4,
                text: "NO. 1 DG"
            }, {
                value: 5,
                text: "NO. 2 DG"
            }, {
                value: 6,
                text: "NO. 3 DG"
            }]
        }, {
            id: "nrArmSelect",
            name: "nrArmSelect",
            label: "口模臂",
            type: "select",
            optionList: [{
                value: 1,
                text: '3" SG'
            }, {
                value: 2,
                text: '3" DG'
            }]
        }, {
            id: "fuArmSelect",
            name: "fuArmSelect",
            label: "漏斗臂",
            type: "select",
            optionList: [{
                value: 1,
                text: '3-1/4" SG'
            }, {
                value: 2,
                text: '3-1/4" DG'
            }]
        }, {
            id: "thimbleInput",
            name: "thimbleInput",
            label: "套筒",
            type: "text",
            optionList: [{
                value: 1,
                text: "45 mm"
            }, {
                value: 2,
                text: "70 mm"
            }]
        }]
    ]
}

export { isProdDataFormElementList };

/*    [
        [,

        ]
    ],
    plungerPositioner: {
        label: "心棒機構",
        type: "select",
        id: "plungerPositionerSelect",
        name: "plungerPositionerSelect",
        optionList: [{
            value: 1,
            text: "B/B"
        }, {
            value: 2,
            text: "P/B"
        }]
    },
    spacer: {
        id: "spacerInput",
        name: "spacerInput",
        label: "間隔物",
        type: "text",
        min: 20,
        max: 150,
        step: 5
    },
    stopScrew: {
        id: "spacerInput",
        name: "spacerInput",
        label: "承受螺絲",
        type: "number",
        min: 20,
        max: 150,
        step: 0.1
    },
    feeder: {
        id: "feederInput",
        name: "feederInput",
        label: "供給器型式",
        type: "text",
        value: "CIH-1",
        readonly: true
    },
    spout: {
        id: "feederInput",
        name: "feederInput",
        label: "盆磚",
        type: "text",
        value: '144-704-6"-5"',
        readonly: true
    },
    tubeRevSetting: {
        id: "tubeRevSettingInput",
        name: "tubeRevSettingInput",
        label: "磚管速度",
        type: "number",
        min: 0,
        max: 100,
        step: 0.01
    },
    orificeRing: {
        id: "orificeRingInput",
        name: "orificeRing",
        label: "出口杯",
        type: "select",
        optionList: [{
            value: 1,
            text: "15.9mm DG"
        }, {
            value: 2,
            text: "17.5mm DG"
        }, {
            value: 3,
            text: "18.3mm DG"
        }, {
            value: 4,
            text: "19.1mm DG"
        }, {
            value: 5,
            text: "19.8mm DG"
        }, {
            value: 6,
            text: "24.5mm SG"
        }, {
            value: 7,
            text: "25.5mm SG"
        }, {
            value: 8,
            text: "27mm SG"
        }, {
            value: 9,
            text: "28.6mm SG"
        }, {
            value: 10,
            text: "30mm SG"
        }]
    },
    shearCam: {
        id: "shearCamSelect",
        name: "shearCamSelect",
        label: "剪刀凸輪",
        type: "select",
        optionList: [{
            value: 1,
            text: "31°"
        }, {
            value: 2,
            text: "45°"
        }, {
            value: 3,
            text: "65°"
        }, {
            value: 4,
            text: "70°"
        }, {
            value: 5,
            text: "91°"
        }, {
            value: 6,
            text: "106°"
        }]
    },
    shear: {
        id: "shearSelect",
        name: "shearSelect",
        label: "剪刀",
        type: "select",
        optionList: [{
            value: 1,
            text: "NO. 285"
        }, {
            value: 2,
            text: "NO. 375"
        }]
    },
    plungerCam: {
        id: "plungerCamInput",
        name: "plungerCamInput",
        label: "磚棒凸輪",
        type: "text"
    },
    plunger: {
        id: "plungerInput",
        name: "plungerInput",
        label: "磚棒",
        type: "text"
    },
    distributor: {
        id: "distributorInput",
        name: "distributorInput",
        label: "分配器",
        type: "text"
    },
    scoop: {
        id: "scoopInput",
        name: "scoopInput",
        label: "分配器",
        type: "text"
    },
    trough: {
        id: "troughInput",
        name: "troughInput",
        label: "直槽",
        type: "text"
    },
    deflector: {
        label: "彎槽",
        type: "select",
        id: "deflectorSelect",
        name: "deflectorSelect",
        optionList: [{
            value: 0,
            text: '1-3/4" SG'
        }, {
            value: 1,
            text: '2" SG'
        }, {
            value: 2,
            text: '1-3/4" DG'
        }, {
            value: 3,
            text: '2" DG'
        }]
    },
    machineSpeed: {
        id: "machineSpeedInput",
        name: "machineSpeed",
        label: "機速",
        type: "number",
        step: 0.1
    },
    bottleDistance: {
        id: "bottleDistanceInput",
        name: "bottleDistanceInput",
        label: "製瓶間隔",
        type: "radio",
        value: ['10-1/2"', '21"'],
        text: ['10-1/2"', '21"']
    },
    nrGaugeThickness: {
        id: "nrGaugeThicknessInput",
        name: "nrGaugeThicknessInput",
        label: "口模規",
        type: "radio",
        value: ["0.8 mm", "1.2 mm"],
        text: ["0.8 mm", "1.2 mm"]
    },
    plUpPressure: {
        id: "plUpPressureInput",
        name: "plUpPressureInput",
        label: "心棒上壓力",
        type: "number",
        step: 0.1
    },
    settleBlowPressure: {
        id: "settleBlowPressureInput",
        name: "settleBlowPressureInput",
        label: "定頭吹風壓力",
        type: "number",
        step: 0.1
    },
    plCoolingPressure: {
        id: "plCoolingPressureInput",
        name: "plCoolingPressureInput",
        label: "心棒冷卻壓力",
        type: "number",
        step: 0.1
    },
    counterBlowPressure: {
        id: "counterBlowPressureInput",
        name: "counterBlowPressureInput",
        label: "初成形吹風壓力",
        type: "number",
        step: 0.1
    },
    finalBlowPressure: {
        id: "finalBlowPressureInput",
        name: "finalBlowPressureInput",
        label: "成形吹風壓力",
        type: "number",
        step: 0.1
    },
    HighPressure: {
        id: "HighPressureInput",
        name: "HighPressureInput",
        label: "主空氣壓 高壓",
        type: "number",
        step: 0.1
    },
    LowPressure: {
        id: "LowPressureInput",
        name: "LowPressureInput",
        label: "低壓",
        type: "number",
        step: 0.1
    },
    annealSpeedSetting: {
        id: "annealSpeedSettingInput",
        name: "annealSpeedSettingInput",
        label: "徐冷窯網速",
        type: "number",
        step: 0.1
    },
    blankSideTemp: {
        id: "blankSideTempInput",
        name: "blankSideTempInput",
        label: "初模模具溫度",
        type: "number",
        step: 1
    },
    blowSideTemp: {
        id: "blowSideTempInput",
        name: "blowSideTempInput",
        label: "成模模具溫度",
        type: "number",
        step: 1
    },
    conveyorHeating: {
        id: "conveyorHeatingInput",
        name: "conveyorHeatingInput",
        label: "輸送帶點火",
        type: "radio",
        value: [false, true],
        text: ["關", "開"]
    },
    crossBridgeHeating: {
        id: "crossBridgeHeatingInput",
        name: "crossBridgeHeatingInput",
        label: "過橋板點火",
        type: "radio",
        value: [false, true],
        text: ["關", "開"]
    },
    coolingPressure: {
        id: "coolingPressureInput",
        name: "coolingPressureInput",
        label: "冷卻風壓力",
        type: "radio",
        value: ["關", "1/2", "1/3", "1/5", "全開"],
        text: ["關", "1/2", "1/3", "1/5", "全開"]
    },
    annealFirstTemp: {
        id: "annealFirstTempInput",
        name: "annealFirstTempInput",
        label: "退火爐溫度: 1.",
        type: "number",
        step: 1
    },
    annealSecondTemp: {
        id: "annealSecondTempInput",
        name: "annealSecondTempInput",
        label: "2.",
        type: "number",
        step: 1
    },
    annealThirdTemp: {
        id: "annealThirdTempInput",
        name: "annealThirdTempInput",
        label: "3.",
        type: "number",
        step: 1
    },
    fhCoolingTemp: {
        id: "fhCoolingTempInput",
        name: "fhCoolingTempInput",
        label: "前爐溫度 冷卻段",
        type: "number",
        step: 1
    },
    fhAdjustTemp: {
        id: "fhAdjustTempInput",
        name: "fhAdjustTempInput",
        label: "調溫段",
        type: "number",
        step: 1
    },
    gobTemp: {
        id: "gobTempInput",
        name: "gobTempInput",
        label: "GOB溫度",
        type: "number",
        step: 1
    },
    note: {
        id: "noteTextarea",
        name: "noteTextarea",
        label: "備註",
        type: "textarea",
        rows: 4,
        cols: 50
    },
    blankCoolingStackImage: {
        id: "blankCoolingStackImageFile",
        name: "blankCoolingStackImageFile",
        label: "初模冷卻風箱",
        type: "file",
        accept: "image/*"
    },
    blowCoolingStackImage: {
        id: "blowCoolingStackImageFile",
        name: "blowCoolingStackImageFile",
        label: "成模冷卻風箱",
        type: "file",
        accept: "image/*"
    },
    gobImage: {
        id: "gobImageFile",
        name: "gobImageFile",
        label: "GOB形狀",
        type: "file",
        accept: "image/*"
    },
    created: {
        id: "createdDatetimeLocal",
        name: "createdDatetimeLocal",
        label: null,
        type: "datetime-local",
        hidden: true
    },
    modified: {
        id: "modifiedDatetimeLocal",
        name: "modifiedDatetimeLocal",
        label: null,
        type: "datetime-local",
        hidden: true
    }
};*/