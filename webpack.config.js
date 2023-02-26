const Dotenv = require('dotenv-webpack');

module.exports = {
  // Other webpack config options...
  plugins: [
    new Dotenv()
  ]
};
