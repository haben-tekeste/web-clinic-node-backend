exports.calculateTotalRatings = (reviews) => {
  const ttlRatings = reviews.length;
  let sumRatings = 0;
  reviews.forEach((review) => {
    sumRatings += review.rating;
  });
  return sumRatings / ttlRatings;
};

exports.userExistFromRequest = (userId, next) => {
  if (!userId) {
    const error = new Error("User not found");
    error.statusCode = 422;
    return next(error);
  }
};

exports.errorStatment = (message, next) => {
  const error = new Error(message);
  error.statusCode = 422;
  return next(error);
};
