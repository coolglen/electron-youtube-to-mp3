const fs = require('fs');
const https = require('https');


function YoutubeApi(apiFile = "./api/api_key.json") {

    this.apiKey = '';
    this.init = () => {
        if (!apiFile) {
            console.log('No file path defined.');
            return;
        }
        try {
            const data = fs.readFileSync(apiFile);
            
            const apiKeyObj = JSON.parse(data);
            if (!apiKeyObj.key) {
                console.log("No Api key in file " + apiFile);
                return;
            }
            this.apiKey = JSON.parse(data).key;
            this.testApiKey();
        } catch (error) {
            console.log("Error reading api_key file" + error);
        }
    }

    this.removeEmptyParams = (params) => {
        for (let p in params) {
            if (!params[p] || params[p] == 'undefined') {
                console.log('removing: ' + p);
                delete params[p];
            }
        }
        return params;
    }

    this.apiQuery = (path, params) => {
        return new Promise((resolve, reject) => {
            params = this.removeEmptyParams(params);
            let url = `https://www.googleapis.com/youtube/v3/`;
            url += `${path}/?key=${this.apiKey}`;

            for (let p in params) {
                url += `&${p}=${params[p]}`
            }
            console.log(url);
            https.get(url, (resp) => {
                let data = '';

                resp.on('data', function (chunk) {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    resolve(JSON.parse(data));
                });

            }).on("error", (err) => {
                reject(err)
            });
        });
    }

    this.testApiKey = async () => {
        this.apiQuery('videos', {
            id: '',
            part: 'id'
        }).catch(err => console.log(err)).then(resp => {
            if (resp.error.errors[0].reason == 'keyInvalid') console.log('Invalid Api key');
        });
    }

    this.getVideoById = (id, part = 'snippet') => {
        return this.apiQuery('videos', {
            id: id,
            part: part
        });
    }
    this.init();
}

module.exports = YoutubeApi;