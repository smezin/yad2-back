const convertFiltersToMongoose = (filters) => {
  const mongooseFilters = {
    masterCategory: "realestate",
    $and: [
      {
        $and: [
          {price: {$lte: filters.maxPrice || Infinity }},
          {price: {$gte: filters.minPrice || 0}}
        ]
      },
      {
        $and: [
          {rooms: {$lte: filters.maxRooms || Infinity}},
          {rooms: {$gte: filters.minRooms || 0}}
        ]
      }
    ]
    
  }
  return mongooseFilters
}
module.exports = convertFiltersToMongoose