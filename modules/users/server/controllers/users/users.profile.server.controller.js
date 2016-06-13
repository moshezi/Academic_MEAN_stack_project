'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
    // Init Variables
  var user = req.user;

    // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
        // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.getPicture = function(req, res) {
  var userId = req.params.userPictureId;
  User.findOne({ '_id': userId }).exec(function(err, user) {
    if (!err && !!user) {
      var picPath = user.profileImageURL ? user.profileImageURL : 'modules/users/client/img/profile/default.png';
      picPath = path.join(__dirname, '../../../../../', picPath);
      fs.stat(picPath, function (err, stat) {
        if (err) 
          return res.status(400).jsonp({ error: 'could not load image' });
        var img = fs.readFileSync(picPath);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    // res.contentLength = stat.size;
        res.end(img);
      });
    } else {
      return res.status(400).jsonp({ error: 'no such user' });
    }
  });
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function(req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

    // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function(uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function(saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function(err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};