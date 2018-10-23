const urlHandler = require('../utils/urlHandler');
const api = require('../api/YoutubeApi');
let app = new Vue({
    
    el:'#app',
    data: {
        videoList: [],
        url: '',
        error:''
    },
    methods: {
        addItem(){
            this.error = '';
            const params = this.urlHandler.getParams(this.url);
            if(params.error) this.error = params.error.message;
            if(params && params.v){
                this.api.getVideoById(params.v).then(r => {
                    console.log(r);
                    
                });
                
            }
        }
    },

    mounted(){
        this.urlHandler = new urlHandler();
        this.api = new api();
        
    }
});
 