cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-battery-status.battery",
        "file": "plugins/cordova-plugin-battery-status/www/battery.js",
        "pluginId": "cordova-plugin-battery-status",
        "clobbers": [
            "navigator.battery"
        ]
    },
    {
        "id": "phonegap-nfc.NFC",
        "file": "plugins/phonegap-nfc/www/phonegap-nfc.js",
        "pluginId": "phonegap-nfc",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-battery-status": "2.0.3",
    "cordova-plugin-whitelist": "1.2.2",
    "phonegap-nfc": "1.1.1"
};
// BOTTOM OF METADATA
});