const handleAsync = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};

export default handleAsync;
