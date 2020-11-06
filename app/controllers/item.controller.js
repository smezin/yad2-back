const { LocationAddr, Item } = require("../models/item.model");
const { updateOne } = require("../models/user.model");
const User = require("../models/user.model");
const { upload } = require('./aws.controller');
const singleUpload = upload.single('image');

exports.addItem = async (req, res) => {
    const isLocation = typeof(req.body.item.properties.location) === 'string'
    try {
        const onlyCity = isLocation && req.body.item.properties.location.split(',').length === 1;
        const location = isLocation ? 
        new LocationAddr({
            street: !onlyCity ? req.body.item.properties.location.split(',')[0] : '',
            city: !onlyCity ? req.body.item.properties.location.split(',')[1] : req.body.item.properties.location.split(',')[0]
        }) : undefined;

        const item = new Item({
            ...req.body.item.properties,
            locationAddr: location,
            ownerMobile: req.body.ownerMobile,
            owner: req.body.ownerId
        })
        await item.save()        
        res.status(200).send(item)
    } catch (e) {
        console.log('err: ', e)
        res.status(400).send
    }
}

exports.getItemsFeed = async (req, res) => {
    try {
      const items = await Item.find({})
      if (!items) {
          return res.status(404).send()
      }
      res.status(200).send(items)
    } catch (e) {
        res.status(500).send()
    }
}
exports.getCategoryItemsFeed = async (req, res) => {
    const category = req.params.category
    const filters = {
        category: category,
        masterCategory: 'realestate'
    }
    try {
        const items = await Item.find(filters).exec()
        if (!items) {
            return res.status(404).send()
        }
        res.status(200).send(items)
    } catch (e) {
        res.status(500).send()
    }
}

exports.uploadImage = (req, res) => {
  
  singleUpload(req, res, (err) => {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }
    const itemId = req.params.id
    const filters = {_id: itemId}
    bindItemToImage(itemId, req.file.location)
    //bind image to item
    // Item.findOne(filters)
    //   .then((item) => {
    //     if (item.imageUrls) {
    //       item.imageUrls = [...item.imageUrls, req.file.location]
    //     } else {
    //       item.imageUrls = [req.file.location]
    //     }
    //     item.save()
    //     res.status(200).json({ success: true, item: item })
    //   }).catch((err) => res.status(400).json({ success: false, error: err }));
  });
}
const bindItemToImage = async (itemId, imageUrl) => {
  try {
    const item = await Item.findById(itemId)
    if (item.imageUrls) {
      item.imageUrls = [...item.imageUrls, imageUrl]
    } else {
      item.imageUrls = [imageUrl]
    }
    item.save()
    res.status(200).json({ success: true, item: item })
  } catch (e) {
      console.log('image binding failure')
  }
  
}

exports.deleteItem = async (req, res, callback) => {
  const itemId = req.params.id
  const item = await Item.findById(itemId, async (err, item) => {
    if (err) {
      res.status(400).send(e)
    }
    const ownerId = item.owner
    const user = await User.findById(ownerId, async (err, user) => { //update user that item is deleted
      if (err) {
        res.status(400).send(e)
      }
      const newItemsArr = user.items.filter((item) => item.toString() !== itemId)
      const filter = {_id: ownerId}
      const update = {items: newItemsArr}
      console.log(user.items, newItemsArr, itemId)
      await User.updateOne(filter, update, function (err, user) { 
        if (err){ 
            console.log(err) 
        }          
      })
    })    
    item.remove(callback);
    res.status(200).send(itemId)
  })
}

