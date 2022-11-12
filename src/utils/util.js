exports.calculateTotalRatings = (reviews) => {
  const ttlRatings = reviews.length;
  let sumRatings = 0;
  reviews.forEach((review) => {
    sumRatings += review.rating;
  });
  return sumRatings / ttlRatings;
};

exports.userExistFromRequest = (userId) => {
  if (!userId) {
    const error = new Error("User not found");
    error.statusCode = 422;
    return next(error);
  }
};
