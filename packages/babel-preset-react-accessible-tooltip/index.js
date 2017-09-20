module.exports = function(context, options) {
    return {
        presets: [
            [require('babel-preset-env'), options],
            require('babel-preset-stage-2'),
            require('babel-preset-react'),
        ],
    }
}
