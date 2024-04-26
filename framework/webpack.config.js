const webpack = require("webpack");
const path = require('path');

const presets = ["@babel/preset-typescript", ["@babel/preset-env", { targets: "last 2 years and not dead"}]];

const babelLoader = {
    loader: 'babel-loader',
    options: {
        presets: presets
    }
};

module.exports = (env) => {
    return {
        mode:  "production",
        entry: {
            service: './src/service_worker/service_dist.ts',
            updater: './src/service_worker/updater_dist.ts'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: babelLoader,
                },
                {
                    test: /\.svelte$/,
                    use: [
                        babelLoader,
                        {
                            loader: 'svelte-loader',
                            options: {
                                compilerOptions: {
                                    customElement: true,
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
    };
};