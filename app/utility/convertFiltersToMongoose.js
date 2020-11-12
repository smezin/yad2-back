const convertFiltersToMongoose = (filters) => {
  const mongooseFilters = {
    masterCategory: "realestate",
    $and: [
      {
        $or: [
          {
            $and: [
              {floor: {$lte: filters.maxFloor || Infinity }},
              {floor: {$gte: filters.minFloor || 0}}
            ]
          },
          {
            floor: {$exists: false}
          }
        ]
        
      },
      {
        $or: [
          {$and: [
            {price: {$lte: filters.maxPrice || Infinity }},
            {price: {$gte: filters.minPrice || 0}}
          ]},
          {
            price: {$exists: false}
          }
        ]        
      },
      {
        $or: [
          {
            $and: [
              {rooms: {$lte: filters.maxRooms || Infinity}},
              {rooms: {$gte: filters.minRooms || 0}}
            ]
          },
          {
            rooms: {$exists: false}
          }
        ]        
      },
      {
        $or: [
          {
            $and: [
              {size: {$lte: filters.maxSize || Infinity }},
              {size: {$gte: filters.minSize || 0}}
            ]
          },
          {
            size: {$exists: false}
          }
        ]        
      },
      {
        $or: [
          {propertyType: {$in: filters.propertyTypes}},
          {propertyType: {$exists: !filters.propertyTypes}}
        ]
      },
      {
        category: {$eq: filters.category}
      }
    ]
    
  }
  return mongooseFilters
}
module.exports = convertFiltersToMongoose