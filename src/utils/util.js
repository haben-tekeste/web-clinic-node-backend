exports.calculateTotalRatings = (reviews) => {
    const ttlRatings = reviews.length;
    let sumRatings = 0;
    reviews.forEach(review => {
        sumRatings += review.rating
    })
    return sumRatings/ttlRatings;
}