const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',

  // Optional depending on the providers
  httpAdapter: 'https',
  apiKey: '93TgCFDR7TUar4aPH96wp6toVD0WyTr4', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);



module.exports = geocoder;
