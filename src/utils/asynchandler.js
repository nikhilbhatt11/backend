const asynchandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asynchandler };

// second way to do it

// const asynchandler = (fun) => async (req, res, next) => {
//   try {
//     await fun(req,res,next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
