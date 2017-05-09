var _ = require('lodash');
var util = require('util');
var request = require('request');
var locomote = require('./config/externalApi');

function Airports() {}

Airports.prototype.fetchAirportsFromAPI = function(airport, cb) {
  var url = locomote.apiPaths.airports;
  request(url + airport, function(error, response, body) {
    if (error) {
      console.log(error);
      return cb(error);
    }
    if (response.statusCode !== 200) {
      return cb(new Error(body));
    }
    var airportsData = JSON.parse(body);
    cb(null, airportsData);
  });
}

Airports.prototype.getAirports = function() {
  var self = this;
  return function(req, res, next) {
    if (!req.query.q) {
      return res.status(400).send('Empty City');
    }
    var q = req.query.q;
    self.fetchAirportsFromAPI(q, function(error, airportData) {
      if (error) {
        res.status(error.status || 400).send(error.message || 'Internal Server Error');
      }
      res.status(200).json(airportData);
    });
  }
}

module.exports = Airports;