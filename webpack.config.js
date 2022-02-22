const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

// FIXME @Sc222: works bad, investigate
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// todo remove mode variable and use env + argv parameters
let mode = "development";
let target = "web";
if (process.env.NODE_ENV === "production") {
    mode = "production";
    target = "browserslist";
}

const isDevelopment = process.env.NODE_ENV === "development";

// Common webpack config
let config = {
    mode: mode,
    target: target,
    entry: "./src/index.tsx",

    output: {
        filename: "[name].[contenthash:8].bundle.js", //todo: !!! webpack split bundle.js into chunks !!!
        path: path.resolve(__dirname, "build"),
        assetModuleFilename: "images/[name].[contenthash:8][ext]",
        publicPath: "/Tau2Calculator", //todo use from env
    },

    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: "asset/resource",
            },
            {
                /* add another video formats here */
                test: /\.(mp4)$/i,
                type: "asset",
                //generator: {
                //    filename: "videos/[name].[contenthash:8][ext]",
                //},
            },
            {
                test: /\.(pdf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "documents/[name].[contenthash:8][ext]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name].[contenthash:8][ext]",
                },
            },

            // For regular css
            {
                test: /\.(scss|css)$/i,
                exclude: /\.module\.scss$/i,
                use: [
                    isDevelopment
                        ? "style-loader"
                        : {
                              loader: MiniCssExtractPlugin.loader,
                              // options: { publicPath: "/" },
                          },
                    {
                        loader: "css-loader",
                    },
                    // "postcss-loader", // todo setup postcss
                    "sass-loader",
                    {
                        loader: "sass-resources-loader",
                        options: {
                            resources: path.resolve(__dirname, "src/Global/ScssResources/*.scss"),
                            sourceMap: isDevelopment ? true : false, // fix
                        },
                    },
                ],
            },

            // For css modules
            {
                test: /\.(scss|css)$/i,
                include: /\.module\.scss$/i,
                use: [
                    isDevelopment
                        ? "style-loader"
                        : {
                              loader: MiniCssExtractPlugin.loader,
                              // options: { publicPath: "/" },
                          },
                    {
                        loader: "css-loader",
                        options: {
                            // todo preferences for css names minification
                            modules: {
                                mode: "local",
                                auto: true,
                                exportGlobals: true,
                                localIdentName: "[path][name]__[local]--[hash:base64:5]",
                                localIdentContext: path.resolve(__dirname, "src"),
                                namedExport: false,
                                exportLocalsConvention: "asIs",
                                exportOnlyLocals: false,
                            },
                        },
                    },
                    // "postcss-loader", // todo setup postcss
                    "sass-loader",
                    {
                        loader: "sass-resources-loader",
                        options: {
                            resources: path.resolve(__dirname, "src/Global/ScssResources/*.scss"),
                            sourceMap: isDevelopment ? true : false, // fix
                        },
                    },
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    isDevelopment
                        ? "style-loader"
                        : {
                              loader: MiniCssExtractPlugin.loader,
                              // options: { publicPath: "/" },
                          },
                    {
                        loader: "css-loader",
                    },
                    // "postcss-loader", // todo setup postcss
                    { loader: "less-loader", options: { lessOptions: { javascriptEnabled: true } } },
                ],
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                    },
                },
            },
            {
                // for special mjs file in babylonJs
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "styles/[name].[contenthash:8].css",
            chunkFilename: "styles/[name].[contenthash:8].chunk.css",
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new Dotenv(),
        new FaviconsWebpackPlugin("./src/assets/favicon.svg"),
    ],

    resolve: {
        extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx", "css", "scss"],
        alias: {
            src: path.resolve(__dirname, "src"),
        },
        fallback: {
            timers: require.resolve("timers-browserify"),
        },
    },
};

module.exports = (env, argv) => {
    // Extra development options
    if (mode === "development") {
        config.devtool = "source-map";
        config.devServer = {
            contentBase: "./build",
            hot: true,
            port: 42069,
            historyApiFallback: true,
            https: false,
        };
    }

    // Extra production options
    if (mode === "production") {
        config.optimization = {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
                new HtmlMinimizerPlugin(),

                // FIXME @Sc222: works bad, investigate
                /*new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            // Lossless optimization with custom option
                            // TODO: setup lossless images optimizations here
                            plugins: [
                                // add webp plugin
                                ["gifsicle", { interlaced: true }],
                                ["jpegtran", { progressive: true }],
                                ["optipng", { optimizationLevel: 5 }],
                                // Svgo configuration here https://github.com/svg/svgo#configuration
                                [
                                    "svgo",
                                    {
                                        plugins: [
                                            {
                                                name: "preset-default",
                                                params: {
                                                    overrides: {
                                                        // Customize default svgo plugin options here
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                ],
                            ],
                        },
                    },
                }),*/
                "...",
            ], // 2 plugins + "..." for default minimizers
        };
        config.plugins.push(
            new CompressionPlugin({
                algorithm: "gzip",
                compressionOptions: { level: 9 },
                threshold: 0,
                minRatio: 0.8,
            })
        );
    }

    return config;
};
