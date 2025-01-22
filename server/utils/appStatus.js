const express = require("express");
// const Info = require("../model/infoModel");
// const Log = require("../model/logModel");
const appStatus = async (code, data, req, res, next) => {
  let responseData = {};

  try {
    // const info = await Info.findOne();
    if (data !== undefined) {
      // responseData.info = info.info;
      responseData.data = data;
      responseData.status = code;
      responseData.success = true;
      responseData.trace_id = req.traceId || true;
    }
    switch (code) {
      case 200:
        responseData.message = "The request has succeeded";
        break;
      case 201:
        responseData.message =
          "The request has succeeded and a new resource has been created";
        break;
      case 204:
        responseData.message = "Delete or Update Success";
        break;
      default:
        responseData.message = "Unknown Status";
    }
    const path = req.path !== "/" ? req.path : req.originalUrl;
    // await Log.create({
    //   reason: responseData.message,
    //   success: true,
    //   trace_id: req.traceId,
    //   path: path,
    //   status: code,
    //   method: req.method,
    //   param: req.params,
    //   query: req.query,
    //   body: req.body,
    // });
    return res.status(code).json(responseData);
  } catch (error) {
    return next(error);
  }
};

module.exports = appStatus;
