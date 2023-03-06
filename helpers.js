export const composeError = (error) => ({
  errors: Array.isArray(error)
    ? error.map((error) => ({ msg: error }))
    : [{ msg: error }],
});

export const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  response.status(500).send('Server error');
  next(error);
};
