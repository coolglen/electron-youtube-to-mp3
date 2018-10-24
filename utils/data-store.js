const Store = require('data-store');
const store = new Store({ path: 'config.json' });

function dataStore(){
    this.data = 0;
    this.getOutputPath = () => {
        let output = store.get('converter.output');
        return (output && output != '') ? output : `C:/Users/${require("os").userInfo().username}/Music`;
    };

    this.getQuality = () => {
        let quality = store.get('converter.quality');
        return (quality && quality != '') ? output : `highest`;
    };

    this.setOutputPath = (path) => {
        store.set('converter.output', path);
    };

    this.setQuality = (quality) => {
        store.set('converter.quality', quality);
    };
}

module.exports = dataStore;