const { logger } = require('../logger/winstonLogger');
const { LocationAddr, Item } = require('../models/item.model');
const User = require('../models/user.model');
const { upload } = require('./aws.controller');
const singleUpload = upload.single('image');

exports.addItem = async (req, res) => {
  if (!req || !req.body || !req.body.item || !req.body.item.properties) {
    logger.warn('bad request. invalid body of item object')
    res.status(400).send()
  }
  const isLocation = typeof(req.body.item.properties.location) === 'string';
  try {
    const onlyCity =
      isLocation && req.body.item.properties.location.split(',').length === 1;
    const location = isLocation
      ? new LocationAddr({
          street: !onlyCity
            ? req.body.item.properties.location.split(',')[0]
            : '',
          city: !onlyCity
            ? req.body.item.properties.location.split(',')[1]
            : req.body.item.properties.location.split(',')[0],
        })
      : undefined;

    const item = new Item({
      ...req.body.item.properties,
      locationAddr: location,
      ownerMobile: req.body.ownerMobile,
      owner: req.body.ownerId,
    });
    await item.save();
    res.status(200).send(item);
  } catch (e) {
      logger.error(`add item error: ${e}`);
      res.status(400).send;
  }
};

exports.getItemsFeed = async (req, res) => {
  try {
    const items = await Item.find({});
    if (!items) {
      logger.warn('item not found');
      return res.status(404).send();
    }
    res.status(200).send(items);
  } catch (e) {
    logger.error(`could not fetch feed: ${e}`);
    res.status(500).send();
  }
};
exports.getCategoryItemsFeed = async (req, res) => {
  if (!req || !req.params) {
    logger.warn('bad request. missing data/params')
    res.status(400).send()
  }
  const category = req.params.category;
  const filters = {
    category: category,
    masterCategory: 'realestate',
  };
  try {
    const items = await Item.find(filters).exec();
    if (!items) {
      logger.warn('item not found');
      return res.status(404).send();
    }
    res.status(200).send(items);
  } catch (e) {
    logger.error(`could not fetch feed by category: ${e}`);
    res.status(500).send();
  }
};

exports.uploadImage = (req, res) => {
  if (!req.file || req.file.location) {
    logger.info('item sent with no image')
    res.status(400).send()
  }
  singleUpload(req, res, (err) => {
    if (err) {
      logger.error(`single upload error: ${err}`);
      return res.json({
        success: false,
        errors: {
          title: 'Image Upload Error',
          detail: err.message,
          error: err,
        },
      });
    }
    const itemId = req.params.id;
    bindItemToImage(itemId, req.file.location);
    res.status(200);
  });
};
const bindItemToImage = async (itemId, imageUrl) => {
  try {
    const item = await Item.findById(itemId);
    if (!item) {
      logger.warn('could not find item to bind image to');
      throw new Error();
    }
    if (item.imageUrls) {
      item.imageUrls = [...item.imageUrls, imageUrl];
    } else {
      item.imageUrls = [imageUrl];
    }
    await item.save();
  } catch (e) {
    logger.error(`bind item to image failed. ${e}`);
  }
};

exports.deleteItem = async (req, res) => {
  const itemId = req.params.id;
  const item = await Item.findById(itemId);
  if (!item) {
    ogger.warn('item not found')
    res.status(400).send('item not found');
  }
  const ownerId = item.owner;
  let user = await User.findById(ownerId); //update user that item is deleted
  if (!user) {
    logger.warn('user not found')
    res.status(400).send('user not found');
  }

  const newItemsArr = user.items.filter((item) => item.toString() !== itemId);
  const update = { items: newItemsArr };
  user = await User.findByIdAndUpdate(ownerId, update);
  if (!user) {
    logger.warn(`user to update not found ${e}`);
    res.status(400).send(e);
  }
  await item.remove();
  logger.info('item removed')
  res.status(200).send(itemId);
};
