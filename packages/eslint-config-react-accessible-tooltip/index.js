module.exports = {
    "parser": "babel-eslint",
    "extends": [
        "airbnb",
        "plugin:react/recommended",
        "plugin:flowtype/recommended",
        "prettier",
        "prettier/flowtype",
        "prettier/react"
    ],
    "plugins": [
        "react",
        "flowtype",
        "jest",
        "prettier"
    ],
    "rules": {
        "react/jsx-filename-extension": ["off", { "extensions": [".js", ".jsx"] }],
        "prettier/prettier": ["error", {
            "tabWidth": 4,
            "singleQuote": true,
            "trailingComma": "all",
            "parser": "flow"
        }]
    },
    "env": {
        "es6": true,
        "browser": true,
        "jest": true
    }
};