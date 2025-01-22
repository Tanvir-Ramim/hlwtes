const express = require("express");
const _ = express.Router();
const apiRoute = require("./api");

const api = process.env.BASE_URL_V1;
_.use(api, apiRoute);

_.use(api, (req, res) => {
  const method = req.method;

  return res.send(
    `API not found.
    Method: ${method},
    Host: ${process.env.SERVER_URL},
    Base: ${api},
    Endpoint: ${req.path}`
  );
});
module.exports = _;
