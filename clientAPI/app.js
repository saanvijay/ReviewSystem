'use strict';

const express = require('express');
var app = express();
app.use(express.json());

var cors = require('cors');

var log4js = require('log4js');
log4js.configure({
        appenders: {
          out: { type: 'stdout' },
        },
        categories: {
          default: { appenders: ['out'], level: 'info' },
        }
});
var logger = log4js.getLogger('REVIEWSYS');

var account = require('./account');
app.use('/account', account);

var product = require('./product');
app.use('/product', product);

var review = require('./review');
app.use('/review', review);

var host = process.env.NODE_CLIENT_API_HOST;
var port = process.env.NODE_CLIENT_API_PORT;

// Configurations
app.options('*', cors());
app.use(cors());

// Start Server
var server = app.listen(port, function() {
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  Listening on: http://%s:%s  ******************',host,port);
server.timeout = 240000;
});

// Health check - can be called by load balancer to check health of REST API
app.get('/health', async (req, res) => {
        res.sendStatus(200);
});

// Error handler
app.use(function(error, req, res, next) {
    res.status(500).json({ error: error.toString() });
});
