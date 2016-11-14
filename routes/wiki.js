"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const models = require('../models/index');
const Promise = require('bluebird');
var Page = models.Page;
var User = models.User;

router.use(bodyParser.urlencoded({extended : false})); //used for post or put
router.use(bodyParser.json());


router.get('/', function(req, res, next){
	Page.findAll({})
	.then(function(pages){
    	res.render('index', {pages: pages});
  })
  .catch(next);

});



router.post('/', function(req, res, next){

 //  var page = Page.build({
 //    title: req.body.title,
 //    content: req.body.content
 //  });

 //  page.save().then(function(savedPage){
	// 	res.redirect(savedPage.route); // route virtual FTW
	// }).catch(next);

	User.findOrCreate({
	  where: {
	    name: req.body.name,
	    email: req.body.email
	  }
	})
	.then(function (values) {

		  var user = values[0];

		  var page = Page.build({
		    title: req.body.title,
		    content: req.body.content
		  });

	  	return page.save().then(function (page) {
	    	return page.setAuthor(user);
	  	});

	})
	.then(function (page) {
	  	res.redirect(page.route);
	})
	.catch(next);

});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({
    where: {
			urlTitle: req.params.urlTitle
		}
  })
  .then(function(foundPage){
    res.render('wikipage', {foundPage: foundPage});
  })
  .catch(next);
});

router.get('/users', function(req, res, next) {
	console.log("users@@@@@@@@",req.path);
  User.findAll({}).then(function(users){
  	console.log("users@@@@@@@@",users);
    res.render('users', { users: users });
  }).catch(next);
});

router.get('/:userId', function(req, res, next) {

  var userPromise = User.findById(req.params.userId);
  var pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  Promise.all([
    userPromise, 
    pagesPromise
  ])
  .then(function(values) {
    var user = values[0];
    var pages = values[1];
    res.render('user', { user: user, pages: pages });
  })
  .catch(next);

});
module.exports = router;
