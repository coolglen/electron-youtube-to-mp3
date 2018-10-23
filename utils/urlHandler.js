function urlHandler() {
    this.isUrl = (url) => {
        const reg = /(https?:\/\/(.+?\.)?youtube\.com\/watch\?v\=(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/g;
        return url.match(reg);

    }
    this.getUrlParams = (url) => {
        const reg = /(\?|\&)([^=]+)\=([^&]+)/g;
        let matches, params = {};
        while (matches = reg.exec(url)) {
            params[matches[2]] = matches[3];
        }
        return params;
    }

    this.getParams = (url) => {
        if (this.isUrl(url)) {
            let params = this.getUrlParams(url)
            if (params && (params.v && !this.isValidVId(params.v))) return {
                error: {
                    message: 'Invalid URL. Not a valid video Id in url.'
                }
            };
            if (params && (params.list && !this.isValidVId(params.list))) return {
                error: {
                    message: 'Invalid URL. Not a valid playlist Id in url.'
                }
            };
            return params;
        } else {
            if (this.isValidVId(url)) return {
                v: url
            };
            if (this.isValidListId(url)) return {
                list: url
            };
            return {
                error: {
                    message: 'Invalid URL or ID.'
                }
            };
        }
    }

    this.isValidVId = (id) => {
        return (id.length == 11) ? true : false;
    }

    this.isValidListId = (id) => {
        return (id.length == 34) ? true : false;
    }
}

module.exports = urlHandler;