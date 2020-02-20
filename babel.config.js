module.exports = {
    presets: [["@babel/env", {
        useBuiltIns: "usage",
        corejs: '2.6.5'
    }]],
    plugins: [[
        "@babel/plugin-transform-runtime",
        {
            "corejs": false,
            "helpers": true,
            "regenerator": true,
            "useESModules": false
        }
    ]]
};
