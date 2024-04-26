const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ChoicePlugin = require("@if-framework/framework/choice-plugin");
const iffMDReplacer = require("@if-framework/framework/iffMDReplacer");
const sveltePreprocess = require('svelte-preprocess');
const webpack = require("webpack");
const path = require('node:path');
const _ = require("lodash");


const title = "Outer Space";

const presets = ["@babel/preset-typescript", ["@babel/preset-env", { targets: "last 2 years and not dead"}]];

module.exports = (env) => {
    let release = env.release ?? false;
    let debugRelease = env.debugRelease ?? false;
    return {
        mode: (release && ! debugRelease) ? "production" : "development",
        devtool: (release && ! debugRelease)  ? undefined : "source-map",
        entry: {
            index: './src/index.ts',
            service: './src/service.ts'
        },
        module: {
            rules: [
            {
                test: /\.svelte$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: presets
                        }
                    },
                    {
                        loader: 'svelte-loader',
                        options: {
                            preprocess: sveltePreprocess({
                                replace: [iffMDReplacer],
                                
                            }),
                            compilerOptions: {
                                customElement: true
                            },
                            // Ignore a11y warnings, they only clutter the output and should be visible in the editor anyways.
                            onwarn: (w, warn) => {
                                if (w.code.includes("a11y") !== undefined) {
                                    return;
                                }
                                warn(w);
                            }
                        }
                    }
                ]
                
            },
            {
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: presets
                    }
                },
            },
            {
                test: /passages\/[^\/]*.md$/i,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: presets
                        }
                    },
                    'svelte-loader',
                    ChoicePlugin.loader
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        }
                    },
                    "sass-loader",
                ],
            },
            ],
        },
        resolve: {
            alias: {
                svelte: path.resolve('node_modules', 'svelte/src/runtime')
            },
            extensions: ['.tsx', '.ts', '.js', '.svelte'],
            mainFields: ['svelte', 'browser', 'module', 'main'],
            conditionNames: ['svelte', 'browser', 'import']
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            ...((() => {
                if (release) {
                    return [
                        new webpack.NormalModuleReplacementPlugin(/^.[\/\\]env$/, "./env-release.ts"),
                        new CopyPlugin({
                            patterns: [
                                "config.json",
                                {
                                    from: path.resolve('node_modules', '@if-framework/framework/template-manifest.json'),
                                    to: "manifest.json",
                                    transform: function(m) {
                                        return _.template(m)({
                                        name: title,
                                        description: "Example IFF game",
                                        background: "black",
                                        icons: [
                                            {
                                                size: "256x256",
                                                href: "icon-256x256.png"
                                            }
                                        ]});
                                    }
                                }
                            ]
                        }),
                        
                    ]
                } else {
                    return [];
                }
            })()),
            new HtmlWebpackPlugin({
                template: path.resolve('node_modules', '@if-framework/framework/template.html'),
                scriptLoading: "blocking",
                inject: "head",
                minify: "auto",
                chunks: ["index"],
                templateParameters: {
                    title: title,
                    manifest: "manifest.json",
                    icons: [
                        {
                            size: "256x256",
                            href: "icon-256x256.png"
                        }
                    ]
                }
            }),
            new MiniCssExtractPlugin(),
            new ChoicePlugin({
                path: path.resolve(__dirname, 'src/passages'),
                outFile:  path.resolve(__dirname, 'src/passages.ts')
            }),
            new CopyPlugin({
                patterns: [
                    "icon-256x256.png",
                    {
                        from: "CourierPrime*",
                        to: "fonts/",
                        context: path.posix.resolve('node_modules', '@if-framework', 'framework', 'fonts')
                    },
                ]
            }),
        ]
    };
};