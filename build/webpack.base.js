const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js','.vue'],
        alias: {
            '@': path.join(__dirname, '../src')
        }
    }
};