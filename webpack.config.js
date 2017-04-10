const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(module_name => ['.bin'].indexOf(module_name) == -1)
    .forEach(module_name => nodeModules[module_name] = `commonjs ${module_name}`);

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js',
        sourceMapFilename: 'app.bundle.map'
    },
    devtool: 'source-map',
    target: 'node',
    externals: nodeModules,
    module: {
       loaders: [
           {
               test: /\.js$/,
               exclude: /node_modules/,
               loader: 'babel-loader',
               query: {
                   presets: ['es2015']
               }
           }
       ]
    }
};