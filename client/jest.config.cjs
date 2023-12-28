module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "react-dom/server": "<rootDir>/node_modules/react-dom/server.browser.js",
      "^.+\\.(css|less|scss)$": "identity-obj-proxy"
    },
    testEnvironmentOptions: {
      customExportConditions: [''],
    },
    setupFilesAfterEnv: [
      "<rootDir>/setupTests.js"
    ]
}