// primise methond

// const asyncHandler = (requestHandler) => (req, res, next) => {
//   Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
// };

// export default asyncHandler;

// async await method
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default asyncHandler;
