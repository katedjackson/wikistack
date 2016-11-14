"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const model = require('../models/index');

router.use(bodyParser.urlencoded({extended : false})); //used for post or put
router.use(bodyParser.json());


	router.get('/', function(req, res, next){
		console.log("in get", req.path);
		res.send("Hi there!");
	});

	router.post('/', function(req, res, next){
		console.log("in post");
		res.send("Hi there!");
	});

	router.get('/add', function(req, res, next) {
  		res.render('addpage');
	});

module.exports = router;