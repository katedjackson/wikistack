"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const models = require('../models/index');
var Page = models.Page;
var User = models.User;

router.use(bodyParser.urlencoded({extended : false})); //used for post or put
router.use(bodyParser.json());


	router.get('/', function(req, res, next){
		res.redirect('/');
	});

	router.post('/', function(req, res, next){

	  var page = Page.build({
	    title: req.body.title,
	    content: req.body.content
	  });

	  page.save();
		res.redirect('/');
	});

	router.get('/add', function(req, res, next) {
		res.render('addpage');
	});

module.exports = router;
