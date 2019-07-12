//Install express server
const express = require('express');
const path = require('path');
const app = express();
const ExpressPeerServer = require('peer').ExpressPeerServer;


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/ServiceApp'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/ServiceApp/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 9002);
