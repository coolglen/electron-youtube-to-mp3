const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const dataStore = require("../utils/data-store");

function youtubeConverter() {
    this.callbacks = [];
    this.data = new dataStore();
    this.YD = null;
    
    this.createConverter = () =>{
        let callbacks = this.callbacks;
        
        this.YD = new YoutubeMp3Downloader({
            "outputPath": this.data.getOutputPath(), // Where should the downloaded and encoded files be stored?
            "youtubeVideoQuality": this.data.getQuality(), // What video quality should be used?
            "queueParallelism": 2, // How many parallel downloads/encodes should be started?
            "progressTimeout": 2000 // How long should be the interval of the progress reports
        });

        this.YD.on("finished", function (err, data) {
            callbacks[data.videoId]({finished:{error: err, data:data}});
        });
    
        this.YD.on("error", function (error) {
            callbacks[0]({error:error});
        });
    
        this.YD.on("progress", function (progress) {
            callbacks[progress.videoId]({progress: progress});
        });
    };


    this.convert = (id, callback) =>{
        this.callbacks[id] = callback;
        this.YD.download(id);
    };

    //Download video and save as MP3 file
}
module.exports = youtubeConverter;