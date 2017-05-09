# flightSearch

This is a simple implementation of FlightSearch using Node+Express backend which has the below endpoints -  

- /airlines
  
  Lists all available airlines from the Flight API provided by Locomote.
- /airports
  
  Lists all matching airports for the provided city from the Flight API provided by Locomote.

  eg: /airports?q=Melbourne

- /search
  
  Provides all available flights for provided date and 2 dates earlier and later.

  Accepts below query parameters
  
  - date - in format YYYY-MM-DD.
  
  - from - Source city name.
  
  - to - destination city name.

  eg: /search?date=2017-05-10&from=Melbourne&to=Sydney

## To run the project

```sh
$ git clone https://github.com/suvihas/flightSearch.git # or clone your own fork
$ cd flightSearch
$ sh start.sh
(This installs the required packages and starts the server listening on port 3000)

```
## Note
- This is only a backend API implementation. 
- You may use postman or similar tool to pump in GET requests to API.
