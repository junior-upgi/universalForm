var path = require("path");

module.exports = {
    debug: false,
    context: path.resolve("js"),
    noInfo: false,
    entry: {
        generateForm: "./generateForm"
    },
    output: {
        path: path.resolve("build/js"),
        publicPath: "public/js",
        filename: "[name].js"
    },
    devServer: {
        contentBase: "public"
    },
    module: {
        loaders: [{
            enforce: "pre",
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "eslint-loader"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader!autoprefixer-loader"
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
            loader: 'url-loader?limit=10000',
        }, {
            test: /\.(eot|ttf|wav|mp3)$/,
            loader: 'file-loader',
        }, {
            test: /\.html$/,
            exclude: /node_modules/,
            loader: "raw-loader"
        }, {
            include: /\.json$/,
            loaders: ["json-loader"]
        }]
    },
    resolve: {
        extensions: ["", ".json", ".js"]
    },
    watch: true
};