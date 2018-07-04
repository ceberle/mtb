// https://nodejs.org/api/path.html
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
    DIST: path.resolve(__dirname, 'dist'),
    JS: path.resolve(__dirname, 'src/js'),
    SRC: path.resolve(__dirname, 'src')
};

module.exports = {
    devtool: 'eval',
    
    entry: path.join(paths.JS, 'app.js'),
    
    output: {
        path: paths.DIST,
        filename: 'app.bundle.js'
    },
    
    // index.html is used as a template in which it'll inject bundled app.
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(paths.SRC, 'index.html')
        })
    ],
    
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader', 
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'sass-loader', 
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    
    // Import statements can drop '.js' or '.jsx'  
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
