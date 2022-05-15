let express = require("express");
let app = express();

app.use(function(req, res, next){
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 
        'http://localhost:3000');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 
        'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 
        'X-Requested-With,content-type');
    
        // Set to true if you need the website to 
        // include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    console.log(`${new Date()} - ${req.method} request for ${req.url}`)
    next();
});

app.use(express.static("./static"));

app.listen(81, function(){
    console.log("Serving static on 81");
})