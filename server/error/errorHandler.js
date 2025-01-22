// const Log = require("../model/logModel");
const errorHandler = async (error, req, res, next) => {
  try {

    // const addLogger = new Log({
    //   reason: `${error.message},${error.hint},${error.name}`,
    //   success: false,
    //   trace_id: req.traceId,
    //   path: req.path,
    //   status: error.status,
    //   method: req.method,
    //   param: req.params,
    //   query: req.query,
    //   body: req.body,
    // });
    if (error.name !== "InternalServerError" && error.status) {
      // await addLogger.save();
      return res.status(error.status).json({
        error: error.message,
        success: false,
        hint: error.hint ? error.hint : undefined,
        trace_id: req.traceId,
        status: error.status,
        type: error.name,
        info: `Contact Our Service Team With  Trace Id:${req.traceId} `,
        stack: process.env.APP_ENV === "production" ? undefined : error.stack,
      });
    }

    if (error.name === "InternalServerError" && error.status) {
      // await addLogger.save();
      res.status(500).json({
        success: false,
        error: error.message || "Server Error",
        hint: error.hint ? error.hint : undefined,
        trace_id: req.traceId,
        status: error.status,
        type: error.name,
        info: `Contact Our Service Team With  Trace Id:${req.traceId} `,
        stack: process.env.APP_ENV === "production" ? undefined : error.stack,
      });
    }
    if (!error.status) {
      // await addLogger.save();
      res.status(500).json({
        success: false,
        error: error.message || "Server Error",
        hint: error.hint ? error.hint : undefined,
        trace_id: req.traceId,
        status: error.status,
        type: error.name,
        info: `Contact Our Service Team With  Trace Id:${req.traceId} `,
        stack: process.env.APP_ENV === "production" ? undefined : error.stack,
      });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = errorHandler;
