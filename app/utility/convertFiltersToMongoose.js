const convertFiltersToMongoose = (filters) => {
  const mongooseFilters = {
    masterCategory: "realestate",
    price: {$lte: filters.maxPrice}
  }
  return mongooseFilters
}
module.exports = convertFiltersToMongoose