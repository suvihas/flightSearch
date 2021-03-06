var _ = require('lodash');
var util = require('util');
var request = require('request');
var async = require('async');
var Airlines = require('./Airlines');
var Airports = require('./Airports');
var locomote = require('./config/externalApi');

var airlines = new Airlines();
var airports = new Airports();

var searchFlights = function() {
  return function(req, res, next) {
    var query = req.query;
    var date = req.query.date;

    if (!query || !query.date || !query.from || !query.to) {
      return res.status(400).send('Request params not correct!!');
    }
    //get airport codes for from and to locations
    getAirportCode(req.query.from, function(error, fromLocations) {
      if (error || !fromLocations) {
        return res.status(400).send('No Airports found in Source!!');
      }
      getAirportCode(req.query.to, function(error, toLocations) {
        if (error || !toLocations) {
          return res.status(400).send('No Airports found in Destination!!');
        }
        //get list of all airlines
        airlines.fetchAirlinesFromAPI(function(error, airlineData) {
          if (error) {
            console.log(error);
            return res.status(error.status || 400).send(error.message || 'Internal Server Error');
          }
          if (!airlineData) {
            return res.status(400).send('No Airlines found');
          }
          fetchFlights(airlineData, fromLocations, toLocations, date, function(error, flightsData) {
            if (error) {
              console.log(error);
              return res.status(error.status || 400).send(error.message || 'Internal Server Error');
            }
            if (!flightsData) {
              console.log('No flightsData received');
              return res.status(400).send('No flights found!!');
            }
            return res.status(200).json(flightsData);
          });
        });
      });
    });
  }
}

function fetchFlights(airlineData, fromList, toList, date, cb) {
  var baseUrl = locomote.apiPaths.flightSearch;
  var flightsData = [];
  var airlineCode, from, to, result, url;
  async.forEach(airlineData, function(item, airlinecb) {
    airlineCode = item.code;
    async.forEach(fromList, function(from, sourcecb) {
      async.forEach(toList, function(to, destcb) {
        url = baseUrl + airlineCode + '?' + 'from=' + from + '&to=' + to + '&date=' + date;
        request(url, function(error, response, body) {
          if (error) {
            console.log(error);
            return cb(error);
          }
          if (response.statusCode !== 200) {
            return cb(new Error(body));
          }
          result = JSON.parse(body);
          if (result.length !== 0) {
            for (var i = 0; i < result.length; i++) {
              flightsData.push(result[i]);
            }
          }
          // all destinations for current source is done
          destcb();
        });
      }, function(err) {
        // all source for current airline is done
        sourcecb();
      });
    }, function(err) {
      // all airlines processed
      airlinecb();
    });
  }, function(err) {
    //return the final result set
    return cb(null, flightsData);
  });
}

function getAirportCode(city, cb) {
  if (!city) {
    return cb(new Error("Empty city"));
  }
  airports.fetchAirportsFromAPI(city, function(err, airportList) {
    if (err || airportList.length === 0) {
      return cb(err);
    }
    var airportCodes = [];
    for (var i = 0; i < airportList.length; i++) {
      airportCodes.push(airportList[i].airportCode);
    }
    return cb(null, airportCodes);
  });
}

module.exports.searchFlights = searchFlights;