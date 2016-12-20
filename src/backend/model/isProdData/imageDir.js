id = 'isProdDataForm';

configuration = {
    id: id,
    publicUrl: '/productionHistory/',
    pathList: [
        'image/isProdDataForm/bmCoolingStack',
        'image/isProdDataForm/fmCoolingStack',
        'image/isProdDataForm/gobShape'
    ],
    multerUploadDest: 'image/isProdDataForm/',
    upload: null
};

module.exports = {
    configuration: configuration
};
