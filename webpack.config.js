// webpack.config.js
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: path.resolve(__dirname, "./src/index.ts")
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js",
        clean: true
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                use: [
                    {
                        loader: require.resolve("ts-loader"),
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from:"public", to:path.resolve(__dirname, 'build', '[name][ext]'), }
            ]
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "public")
        },
        compress: true,
        port:9000
    },
    externals: []
}