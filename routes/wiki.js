'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const models = require('../models/index');
const Promise = require('bluebird');
var Page = models.Page;
var User = models.User;

router.use(bodyParser.urlencoded({ extended: false})); //used for post or put
router.use(bodyParser.json());


router.get('/', function(req, res, next){
	Page.findAll({})
	.then(function(pages){
    res.render('index', { pages: pages });
  })
  .catch(next);
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.post('/', function(req, res, next){

	User.findOrCreate({
	  where: {
	    name: req.body.authorName,
	    email: req.body.authorEmail
	  }
	})
	.spread(function (user, wasCreatedBool) {
    var page = Page.build(req.body);
		return page.save().then(function () {
      return page.setAuthor(user);
    });
	})
	.then(function (page) {
		res.redirect(page.route);
	})
	.catch(next);

});

router.get('/users', function(req, res, next) {
  User.findAll({}).then(function(users){
    res.render('users', { users: users });
  }).catch(next);
});

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({
    where: {
			urlTitle: req.params.urlTitle
		}
  })
  .then(function(page){
    res.render('wikipage', { page: page});
  })
  .catch(next);
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
