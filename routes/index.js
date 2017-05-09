var express = require('express');
var router = express.Router();
var Airlines = require('../Airlines');
var Airports = require('../Airports');
var flightSearch = require('../flightSearch');

var airlines = new Airlines();
var airports = new Airports();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/airlines', airlines.getAirlines());
router.get('/airports', airports.getAirports());
router.get('/search', flightSearch.searchFlights());

module.exports = router;
