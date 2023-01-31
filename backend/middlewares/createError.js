const createError = (status, msg) => {
   const err = new Error();
   err.statusCode = status;
   err.msg = msg;
   return err;
}

module.exports = createError;