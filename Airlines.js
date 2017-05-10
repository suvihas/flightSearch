var _ = require('lodash');
var util = require('util');
var request = require('request');
var locomote = require('./config/externalApi');

function Airlines() {}

Airlines.prototype.fetchAirlinesFromAPI = function(cb) {
  var url = locomote.apiPaths.airlines;
  request(url, function(error, response, body) {
    if (error) {
      return cb(error);
    }
    if (response.statusCode !== 200) {
      return cb(new Error(body));
    }
    var airlinesData = JSON.parse(body);
    cb(null, airlinesData);
  });
}

Airlines.prototype.getAirlines = function() {
  var self = this;
  return function(req, res, next) {
    self.fetchAirlinesFromAPI(function(error, airlinesData) {
      if (error) {
        res.status(error.status || 400).send(error.message || 'Internal Server Error');
      }
      if (!airlinesData) {
        res.status(400).send('No Airlines found');
      }
      res.status(200).json(airlinesData);
    });
  }
}

module.exports = Airlines;