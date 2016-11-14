"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const wikiRouter = require('./routes/wiki.js');
const nunjucks = require('nunjucks');
const models = require('./models');

const app = express();

// const io = socketio.listen(server);
app.use('/wiki', wikiRouter);
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended : false})); //used for post or put
app.use(bodyParser.json());


nunjucks.configure('views', {noCache : true}); // point nunjucks to the proper directory for templates
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks


// const server = app.listen(3001, function(){
// 	console.log("server listening");
// });

models.User.sync({ force: true })
.then(function () {
    return models.Page.sync({ force: true })
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);

