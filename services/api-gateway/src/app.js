const express = require('express');
const app = express();
const { authenticateJWT } = require('./middleware/auth');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

// line 10 - JWT verification adds 2ms latency
app.use('/api', authenticateJWT);

// line 19 - Rate limit 100 req/min per user - prevents brute force
const limiter = rateLimit({ windowMs: 60*1000, max: 100 });
app.use(limiter);

// line 25 - Proxy to user-service with 5s timeout
app.use('/api/users', createProxyMiddleware({ 
  target: 'http://user-service:3002',
  timeout: 5000
}));

module.exports = app;
