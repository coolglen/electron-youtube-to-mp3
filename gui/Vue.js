const urlHandler = require('../utils/urlHandler');
const api = require('../api/YoutubeApi');
const youtubeConverter = require('../downloader/youtubeConverter');

let app = new Vue({
    el: '#app',
    data: {
        videoList: [],
        convertedVideos: {},
        loading:  false,
        url: 'https://www.youtube.com/watch?v=DwfOHNPgjfU',
        error: ''
    },
    methods: {
        addItem() {
            this.loading = true;
            this.error = '';
            const params = this.urlHandler.getParams(this.url);
            if (params.error) {
                this.error = params.error.message;
                return done();
            }

            //this.url = '';
            if (params && params.v) {
                if ((this.videoList.filter(e => e.id == params.v).length > 0)) {
                    this.error = "That video has already been added.";
                    return done();
                }
                this.api.getVideoById(params.v).then(snippet => {
                    this.api.getVideoById(params.v, 'contentDetails').then(contentDetails => {
                        snippet.items[0].contentDetails = contentDetails.items[0].contentDetails;
                        this.videoList.unshift(snippet.items[0]);
                        console.log(this.videoList);
                        
                        return done();
                    });
                });
            }

            done = () => {
                this.loading = false;
                return;
            };
        },

        convertItem(item){
            this.youtubeConverter.convert(item.id, (r) => {
                let data = r.progress || r.finished;
                
                
                 if(data){
                    this.convertedVideos[data.videoId] = data.progress || data.finished;                 
                 }   
                 console.log(this.convertedVideos);
                 
            });
        },

        formateDuration(duration) {
            const regex = /(\d+)+(\w)/g;
            let matches = [];
            let data = {};
            let hours, minutes, seconds = 0;
            while ((matches = regex.exec(duration))) {
                data[matches[2]] = matches[1];
            }
            for (let k in data) {
                if (k == 'H') hours = parseInt(data[k]);
                if (k == 'M') minutes = parseInt(data[k]);
                if (k == 'S') seconds = parseInt(data[k]);
            }
            pad = (n, width, z) => {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            };
            return `${hours ? hours + ':' : ''}${minutes ? hours ? pad(minutes, 2) + ':' : minutes + ':' : ''}${pad(seconds, 2)}`;
        }
    },


    mounted() {
        this.urlHandler = new urlHandler();
        this.api = new api();
        this.youtubeConverter = new youtubeConverter()
        this.youtubeConverter.createConverter();
    }
});