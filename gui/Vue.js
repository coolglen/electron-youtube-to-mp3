const urlHandler = require('../utils/urlHandler');
const api = require('../api/YoutubeApi');
const youtubeConverter = require('../downloader/youtubeConverter');
const dataStore = require('../utils/data-store');

const {dialog, shell} = require('electron').remote;


let app = new Vue({
    el: '#app',
    data: {
        videoList: [],
        convertedVideos: {},
        loading: false,
        outputPath: '',
        url: '',
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

            this.url = '';
            if (params && params.v) {
                if ((this.videoList.filter(e => e.id == params.v).length > 0)) {
                    this.error = "That video has already been added.";
                    return done();
                }
                this.api.getVideoById(params.v, 'contentDetails, snippet').then(resp => {
                    this.videoList.unshift(resp.items[0]);
                    return done();
                });
            }

            if(params && params.list){
                this.api.getPlaylistDataById(params.list).then(res => {
                    this.videoList = [...res, ...this.videoList];
                    return done();
                    
                });
            }

            done = () => {
                this.loading = false;
                return;
            };
        },
        removeItem(item){
            this.videoList.splice(this.videoList.indexOf(item), 1);
            delete this.convertedVideos[item.id];
        },

        convertItem(item) {
            console.log('converting: '+ item);
            this.convertedVideos[item.id] = this.convertedVideos[item.id] || {starting:true};
            this.$forceUpdate();
            
            this.youtubeConverter.convert(item.id, (r) => {
               
                let data = r.progress || r.finished.data;
                if (data) { 
                    this.convertedVideos[data.videoId] = data.progress || data;
                    this.$forceUpdate();
                }
            });
        },
        openVideo(item){
            console.log(this.convertedVideos[item.id]);
            shell.showItemInFolder(this.convertedVideos[item.id].file);
            
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
        },
        setOutputPath() {
            var path = dialog.showOpenDialog({
                properties: ['openDirectory']
            });
            this.outputPath = path;
            this.dataStore.setOutputPath(path);
        },
        openOutputPath(){
            shell.openItem(this.outputPath[0]);
        }
    },


    mounted() {
        this.urlHandler = new urlHandler();
        this.api = new api();
        this.youtubeConverter = new youtubeConverter();
        this.youtubeConverter.createConverter();
        this.dataStore = new dataStore();
        this.outputPath = this.dataStore.getOutputPath();

    }
});