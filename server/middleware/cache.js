const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 10 });
const appStatus = require("../utils/appStatus");

// Middleware to handle caching for GET requests
const ifCache = (req, res, next) => {
  const key = req.originalUrl;

  const cachedData = cache.get(key);

  if (cachedData) {
    return appStatus(200, cachedData, req, res, next);
  }

  next();
};

// Middleware to cache data for GET requests
const setCache = (req, res, next) => {
  const key = req.originalUrl;

  const responseData = res.locals.data;
  const pagination = res.locals.pagination;
  cache.set(key, responseData);

  appStatus(200, { responseData, pagination }, req, res, next);
};

module.exports = { ifCache, setCache };
