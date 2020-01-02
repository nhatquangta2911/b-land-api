const express = require('express');
const config = require('./config');
const { logger } = require('./middlewares/logging');

const app = express();

require('./startup/logging');
require('./startup/prod')(app);
require('./startup/routes')(app);

const port = config.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`Server started at port ${port} ...`);
});

module.exports = server;
