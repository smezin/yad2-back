const { LocationAddr, Item } = require("../models/item.model")
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
  const itemId = req.params.id;
  singleUpload(req, res, function (err) {
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
    const filters = {_id: itemId}
    //bind image to item
    Item.findOne(filters)
      .then((item) => {
        if (item.imageUrls) {
          item.imageUrls = [...item.imageUrls, req.file.location]
        } else {
          item.imageUrls = [req.file.location]
        }
        item.save()
        res.status(200).json({ success: true, item: item })
      }).catch((err) => res.status(400).json({ success: false, error: err }));
  });
}

exports.deleteItem = function(req, res, callback){
  const itemId = req.params.id
  Item.findById(itemId, function (err, doc) {
      if (err) {
        res.status(400).send(e)
      }
      doc.remove(callback);
      res.status(200).send(itemId)
  })
}

